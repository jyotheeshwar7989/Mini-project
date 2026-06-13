package com.supportticket.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    private final SecurityContextHolderStrategy
            securityContextHolderStrategy =
            SecurityContextHolder.getContextHolderStrategy();

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Skip auth endpoints
        final String requestPath = request.getServletPath();
        if (requestPath.contains("/api/v1/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader =
                request.getHeader("Authorization");

        // No token — skip
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String userEmail =
                    jwtService.extractUsername(jwt);

            // Always create fresh authentication
            if (userEmail != null) {
                // Clear existing context first
                SecurityContextHolder.clearContext();

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(userEmail);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request));

                    // Create fresh security context
                    SecurityContext context =
                            securityContextHolderStrategy
                                    .createEmptyContext();
                    context.setAuthentication(authToken);
                    securityContextHolderStrategy
                            .setContext(context);
                }
            }
        } catch (Exception e) {
            // Invalid token — clear context
            SecurityContextHolder.clearContext();
            logger.error("JWT Authentication error: "
                    + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}