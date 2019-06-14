package com.example.stc.service.impl;

import com.example.stc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/** 配置用户认证逻辑 */
@Component
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        com.example.stc.domain.User user = userService.getUserByUsername(s);
        if (user == null)
            throw new UsernameNotFoundException("找不到该帐户信息");

        return new User(s, user.getPassword(), getRoles(user)); // org.springframework.security.core.userdetails.User
    }

    /** 获取用户角色 */
    public List<GrantedAuthority> getRoles(com.example.stc.domain.User user){
        List<GrantedAuthority> list = new ArrayList<>();
        for (String role: user.getRoles().split(",")) {
            // 权限如果前缀是ROLE_，security就会认为这是个角色信息，而不是权限，例如ROLE_ADMIN就是ADMIN角色
            list.add(new SimpleGrantedAuthority("ROLE_" + role));
        }
        return list;
    }

}
