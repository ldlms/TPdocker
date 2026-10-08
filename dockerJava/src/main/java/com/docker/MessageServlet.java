package com.docker;

import java.io.IOException;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import javax.sql.DataSource;

import jakarta.annotation.Resource;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


@WebServlet("/messages")
public class MessageServlet extends HttpServlet {

    @Resource(name = "jdbc/helloworld")   
    private DataSource ds;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        try (Connection c = ds.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT texte FROM message");
             ResultSet rs = ps.executeQuery()) {
            StringBuilder json = new StringBuilder("[");
            while (rs.next()) {
                if (json.length() > 1) json.append(',');
                json.append('"').append(rs.getString(1).replace("\"", "\\\"")).append('"');
            }
            resp.getWriter().write(json.append(']').toString());
        } catch (SQLException e) {
            throw new IOException(e);
        }
    }
}