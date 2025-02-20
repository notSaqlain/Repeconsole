package com.unipol.repeapp.servlet;

import com.unipol.repeapp.model.CalendarEvent;
import com.unipol.repeapp.repository.JsonEventRepository;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/aggiungiUtente")
public class AddUserServlet extends HttpServlet {
  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    String date = request.getParameter("date");
    String personName = request.getParameter("personName");
    String color = request.getParameter("color");

    if (date == null || personName == null || color == null) {
      response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Parametri mancanti");
      return;
    }

    CalendarEvent event = new CalendarEvent(date, personName, color);
    JsonEventRepository repository = new JsonEventRepository();
    try {
      repository.addEvent(event);
      response.setContentType("application/json");
      PrintWriter out = response.getWriter();
      out.write("{\"status\":\"success\"}");
    } catch (IOException e) {
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Errore durante la scrittura del file JSON");
      e.printStackTrace();
    }
  }
}
