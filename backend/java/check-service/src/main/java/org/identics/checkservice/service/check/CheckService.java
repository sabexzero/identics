package org.identics.checkservice.service.check;

import org.identics.checkservice.domain.kafka.CheckCompleteMessage;
import org.identics.checkservice.web.requests.CheckRequest;

public interface CheckService {
    void check(CheckRequest request);
    void handleCheckResult(CheckCompleteMessage message);
}
