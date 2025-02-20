package com.unipol.repeapp.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unipol.repeapp.repository.JsonEventRepository;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;

/**
 * Servlet che legge tutti gli eventi dal file JSON
 * e li restituisce in formato JSON.
 */
@WebServlet("/listaEventi")
public class ListaEventiServlet extends HttpServlet {

    private JsonEventRepository repository;
    private ObjectMapper objectMapper;

    @Override
    public void init() throws ServletException {
        super.init();
        repository = new JsonEventRepository();
        objectMapper = new ObjectMapper();
    }

    /**
     * Gestisce la GET: ritorna un JSON array di CalendarEvent
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json; charset=UTF-8");

        // Legge gli eventi dal file tramite il repository
        List<CalendarEvent> events = repository.readEvents();

        // Converte la lista di eventi in JSON
        String json = objectMapper.writeValueAsString(events);

        // Restituisce il JSON in risposta
        response.getWriter().write(json);
    }
}
