package org.identics.monolith.service.facade;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.check.Document;
import org.identics.monolith.service.document.DocumentService;
import org.identics.monolith.service.TransactionService;
import org.identics.monolith.service.UserProfileService;
import org.identics.monolith.service.check.CheckService;
import org.identics.monolith.web.requests.CheckRequest;
import org.identics.monolith.web.requests.UploadContentRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CheckFacade {
    private final CheckService checkService;
    private final DocumentService documentService;
    private final UserProfileService userProfileService;
    private final TransactionService transactionService;

    public void loadAndCheck(
        Long userId,
        UploadContentRequest request
    ) throws JsonProcessingException {
       // Проверяем, есть ли у пользователя доступные проверки
       userProfileService.getUserProfile(userId); // Проверяем существование пользователя
       userProfileService.useCheck(userId); // Списываем проверку

       // Записываем транзакцию использования проверки
       transactionService.useCheck(userId);
       
       Document uploadedDocument = documentService.uploadDocument(
           request,
           userId
       );

       checkService.check(
           CheckRequest.builder()
               .contentId(uploadedDocument.getId())
               .isAiCheck(true)
               .isPlagiarismCheck(true)
               .build()
       );
    }
}
