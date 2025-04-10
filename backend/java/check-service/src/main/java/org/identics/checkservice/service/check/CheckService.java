package org.identics.checkservice.service.check;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.identics.checkservice.domain.check.Check;
import org.identics.checkservice.domain.kafka.CheckCompleteMessage;
import org.identics.checkservice.web.requests.CheckRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CheckService {
    void check(CheckRequest request) throws JsonProcessingException;
    void handleCheckResult(CheckCompleteMessage message);

    Page<Check> getAll(String userId, int page, int size);
}
