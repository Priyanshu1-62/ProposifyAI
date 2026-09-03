// This controller touches nothing beyond the servlet container, guaranteeing
// the fastest possible wake-up signal, independent of downstream dependencies.

package com.proposifyai.core_api.health.controller;

import com.proposifyai.core_api.health.model.HealthBaseResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public HealthBaseResponse healthCheck() {
        return new HealthBaseResponse("HEALTHY", OffsetDateTime.now());
    }
}
