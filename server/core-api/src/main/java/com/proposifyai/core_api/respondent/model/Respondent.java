package com.proposifyai.core_api.respondent.model;

import com.proposifyai.core_api.respondent.constant.InboundEmailStatus;
import com.proposifyai.core_api.respondent.constant.InboundEvaluationStatus;
import com.proposifyai.core_api.respondent.constant.OutboundEmailStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.Date;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "respondent")
@Getter
@Setter
public class Respondent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    private String name;

    private String email;

    @Column(name = "group_id", updatable = false, nullable = false)
    private UUID groupId;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "outboundStatus", columnDefinition = "outbound_email_status")
    private OutboundEmailStatus outbound_status;

    @Column(name = "inboundStatus", columnDefinition = "inbound_email_status")
    private InboundEmailStatus inbound_status;

    @Column(name = "inboundEvaluationStatus", columnDefinition = "outbound_evaluation_status")
    private InboundEvaluationStatus inbound_evaluation_status;

    public Respondent() {
    }
}
