package org.identics.monolith.web.advice;

/**
 * Exception thrown when a requested resource is not found.
 * Will be translated to HTTP 404 Not Found response.
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resourceType, Long id) {
        super(resourceType + " with id " + id + " not found");
    }
    
    public ResourceNotFoundException(String resourceType, String identifier) {
        super(resourceType + " with identifier " + identifier + " not found");
    }
} 