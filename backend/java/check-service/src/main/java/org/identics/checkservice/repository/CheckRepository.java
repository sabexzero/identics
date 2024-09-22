package org.identics.checkservice.repository;

import org.identics.checkservice.domain.check.Check;
import org.identics.checkservice.domain.check.ai.AiCheckStatus;
import org.identics.checkservice.domain.check.plagiarism.PlagiarismCheckStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CheckRepository extends MongoRepository<Check, String> {
    List<Check> findByAiCheckResultStatus(AiCheckStatus status);
    List<Check> findByPlagiarismCheckResultStatus(PlagiarismCheckStatus status);
    List<Check> findByAiCheckResultStatusAndPlagiarismCheckResultStatus(AiCheckStatus aiStatus, PlagiarismCheckStatus plagiarismStatus);
}
