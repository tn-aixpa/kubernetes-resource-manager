package it.smartcommunitylab.dhub.rm.exception;

import java.util.Set;
import java.util.stream.Collectors;

import com.networknt.schema.ValidationMessage;

public class ValidationException extends RuntimeException {
    private String message = "The following validation errors were found: ";

    public ValidationException(Set<ValidationMessage> errors) {
        super();

        String errorMessages = errors.stream().map(ValidationMessage::getMessage).collect(Collectors.joining("; "));
        this.message += errorMessages;
    }

    public String getMessage() {
        return this.message;
    }
}
