package org.identics.monolith.service.facade;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.check.CheckContent;
import org.identics.monolith.service.TransactionService;
import org.identics.monolith.service.UserProfileService;
import org.identics.monolith.service.check.CheckService;
import org.identics.monolith.service.content.CheckContentService;
import org.identics.monolith.web.requests.CheckRequest;
import org.identics.monolith.web.requests.UploadContentRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CheckFacade {
    private final CheckService checkService;
    private final CheckContentService checkContentService;
    private final UserProfileService userProfileService;
    private final TransactionService transactionService;

    public void loadAndCheck(
        Long userId,
        Long folderId,
        Boolean plagiarism,
        Boolean ai,
        UploadContentRequest request
    ) throws JsonProcessingException {
       // Проверяем, есть ли у пользователя доступные проверки
       if (plagiarism || ai) {
           userProfileService.getUserProfile(userId); // Проверяем существование пользователя
           userProfileService.useCheck(userId); // Списываем проверку
           
           // Записываем транзакцию использования проверки
           transactionService.useCheck(userId);
       }
       
       CheckContent uploadedContent = checkContentService.uploadContent(
           request,
           userId,
           folderId
       );

       if (plagiarism || ai) {
           checkService.check(
               CheckRequest.builder()
                   .contentId(uploadedContent.getId())
                   .isAiCheck(ai)
                   .isPlagiarismCheck(plagiarism)
                   .build()
           );
       }
    }
}
