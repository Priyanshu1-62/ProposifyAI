package com.proposifyai.core_api.respondent.repository;

import com.proposifyai.core_api.respondent.model.Respondent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RespondentRepository extends JpaRepository<Respondent, UUID> {

    // Derived Query Methods

    List<Respondent> findByGroupId(String groupId);
}
