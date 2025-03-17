package api.base.com.security.jwt;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import api.base.com.exceptions.LoginFailException;
import api.base.com.mbr.vo.CustomUserDetails;
import api.base.com.mbr.vo.MbrAuthoritieDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * JWT 토큰의 유효성을 검사하고, 인증
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final UserDetailsService userDetailsService;
	private final JwtTokenUtil jwtTokenUtil;

	@Value("${jwt.header}")
	private String HEADER_STRING;
	@Value("${jwt.prefix}")
	private String TOKEN_PREFIX;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		Thread currentThread = Thread.currentThread();
		log.info("현재 실행 중인 스레드: " + currentThread.getName());

		// get token
		String header = request.getHeader(HEADER_STRING);
		String username = null;
		String authToken = null;

		Long mbrSeq = null;
		String groupCode = null;
		String mbrKey = null;
		List<LinkedHashMap> mbrAuthoritiesMap = null;

		if (header != null && header.startsWith(TOKEN_PREFIX)) {
			authToken = header.replace(TOKEN_PREFIX, " ");
			log.info("JwtAuthenticationFilter authToken: : {}", authToken);
			try {
				username = this.jwtTokenUtil.getUsernameFromToken(authToken);
				Claims claims = this.jwtTokenUtil.getClaimsFromToken(authToken);
				mbrSeq = Long.valueOf((Integer) claims.get("mbrSeq"));
				groupCode = (String) claims.get("groupCode");
				mbrKey = (String) claims.get("mbrKey");
				mbrAuthoritiesMap = (List<LinkedHashMap>) claims.get("mbrAuthorities");
			} catch (IllegalArgumentException ex) {//JWT 토큰이 잘못되었습니다.
				log.info("fail get user id");
				log.error(ex.getMessage());
			} catch (ExpiredJwtException ex) {//만료된 JWT 서명입니다.
				log.info("Token expired");
				log.error(ex.getMessage());
			} catch (MalformedJwtException ex) {//잘못된 JWT 서명입니다.
				log.info("Invalid JWT !!");
				log.error(ex.getMessage());
			} catch (UnsupportedJwtException ex) {//지원되지 않는 JWT 서명입니다.
				log.info("Unable to get JWT Token !!");
				log.error(ex.getMessage());
			} catch (Exception e) {
				log.info("Unable to get JWT Token !!");
				log.error(e.getMessage());
			}

		} else {
			log.info("JWT does not begin with Bearer !!");
		}

		if ((username != null)) {
			if (SecurityContextHolder.getContext().getAuthentication() == null) {
				//log.info(SecurityContextHolder.getContext().getAuthentication().getName());
				CustomUserDetails userDetails = (CustomUserDetails) this.userDetailsService.loadUserByUsername(username);
				if (this.jwtTokenUtil.validateToken(authToken, userDetails)) { //토큰 의 저장된 loginId == 디비의 mbrId 체크
					if (mbrKey != null && mbrKey.equals(userDetails.getMbrKey())) {//jwt.secret 누출 대비 2차 보안 체크
						if (groupCode != null)
							userDetails.setGroupCode(groupCode);// 로그인 시 저장한 groupCode 정보
						if (mbrAuthoritiesMap != null) {// 타입 에러 발생... 재 생성
							ObjectMapper objectMapper = new ObjectMapper();
							List<MbrAuthoritieDto> tokenMbrAuthorities = new ArrayList<MbrAuthoritieDto>();
							//List<MbrAuthoritieDto> tokenMbrAuthorities = objectMapper.readValue(mbrAuthorities, ArrayList.class);
							for (Iterator iterator = mbrAuthoritiesMap.iterator(); iterator.hasNext();) {
								MbrAuthoritieDto mbrAuthoritieDto = objectMapper.convertValue((Map) iterator.next(), MbrAuthoritieDto.class);
								tokenMbrAuthorities.add(mbrAuthoritieDto);
							}
							userDetails.setMbrAuthorities(tokenMbrAuthorities);// 로그인 시 저장한 멀티 권한 정보
						}

						// All things going well
						// Authentication stuff
						UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

						authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

						log.info("authenticated user " + username + ", setting security context");

						SecurityContextHolder.getContext().setAuthentication(authenticationToken);
					} else {
						//log.info("Invalid JWT Token !!");
						//throw new LoginFailException("Invalid JWT Token !!");
						//throw new MemberException("인증에 실패하였습니다.\n다시 로그인 하시기 바랍니다.", HttpStatus.PAYMENT_REQUIRED);//402 Payment Required > UI > 401 처리

						// JwtAuthenticationEntryPoint [AuthenticationException > (JwtException) request.getAttribute("exception")] > GlobalExceptionHandler
						//request.setAttribute("exception", new LoginFailException("인증에 실패하였습니다.\n다시 로그인 하시기 바랍니다.", HttpStatus.PAYMENT_REQUIRED)); // 발생한 JwtException을 request에 담기
						request.setAttribute("exception", new JwtException("인증에 실패하였습니다.\n다시 로그인 하시기 바랍니다.")); // 발생한 JwtException을 request에 담기
					}
				} else {
					log.info("Invalid JWT Token !!");
					// JwtAuthenticationEntryPoint [AuthenticationException > (JwtException) request.getAttribute("exception")] > GlobalExceptionHandler
					//request.setAttribute("exception", new LoginFailException("인증에 실패하였습니다.\n다시 로그인 하시기 바랍니다.", HttpStatus.PAYMENT_REQUIRED)); // 발생한 JwtException을 request에 담기
					request.setAttribute("exception", new JwtException("인증에 실패하였습니다.\n다시 로그인 하시기 바랍니다.")); // 발생한 JwtException을 request에 담기
				}
			}
		} else {
			log.info("Username is null or context is not null !!");
			// JwtAuthenticationEntryPoint [AuthenticationException > (JwtException) request.getAttribute("exception")] > GlobalExceptionHandler
			//request.setAttribute("exception", new LoginFailException("인증에 실패하였습니다.\n다시 로그인 하시기 바랍니다.", HttpStatus.PAYMENT_REQUIRED)); // 발생한 JwtException을 request에 담기
			request.setAttribute("exception", new JwtException("인증에 실패하였습니다.\n다시 로그인 하시기 바랍니다.")); // 발생한 JwtException을 request에 담기
		}
		filterChain.doFilter(request, response);
	}
}
