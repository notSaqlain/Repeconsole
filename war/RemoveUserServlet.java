package com.unipol.repeapp.servlet;

import com.unipol.repeapp.model.CalendarEvent;
import com.unipol.repeapp.repository.JsonEventRepository;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/rimuoviUtente")
public class RemoveUserServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
         throws ServletException, IOException {

        String date = request.getParameter("date");
        String personName = request.getParameter("personName");

        if (date == null || date.trim().isEmpty() ||
            personName == null || personName.trim().isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Parametri mancanti");
            return;
        }

        JsonEventRepository repository = new JsonEventRepository();
        List<CalendarEvent> events = repository.readEvents();

        // Rimuove tutti gli eventi che corrispondono a date + personName
        boolean removed = events.removeIf(event ->
        event.getDate().trim().equals(date.trim())
    );

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        if (removed) {
            repository.writeEvents(events);
            out.write("{\"status\":\"success\"}");
        } else {
            out.write("{\"status\":\"not found\"}");
        }
    }
}
