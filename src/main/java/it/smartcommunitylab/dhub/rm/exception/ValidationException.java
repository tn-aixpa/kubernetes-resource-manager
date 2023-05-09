package it.smartcommunitylab.dhub.rm.exception;

import com.networknt.schema.ValidationMessage;
import java.util.Set;
import java.util.stream.Collectors;

public class ValidationException extends RuntimeException {

    // private final String message = "The following validation errors were found: ";

    public ValidationException(Set<ValidationMessage> errors) {
        super("The following validation errors were found: " + errors.stream().map(ValidationMessage::getMessage).collect(Collectors.joining("; ")));
        // String errorMessages = errors.stream().map(ValidationMessage::getMessage).collect(Collectors.joining("; "));
        // this.message = "The following validation errors were found: " + errorMessages;
    }

    // @Override
    // public String getMessage() {
    //     return this.message;
    // }
}
