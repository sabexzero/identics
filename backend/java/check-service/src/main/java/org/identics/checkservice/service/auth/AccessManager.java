package org.identics.checkservice.service.auth;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;

public interface AccessManager {
    <T> boolean hasAccess(Authentication authentication, T attribute);
}
