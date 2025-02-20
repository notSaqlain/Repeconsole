<%@ page import="com.example.unipol.CalendarAssignmentService" %>
<%@ page import="com.example.unipol.CalendarAssignmentService.Assignment" %>
<%@ page import="java.time.LocalDate" %>
<%@ page import="java.util.List" %>
<%@ page contentType="application/json;charset=UTF-8" %>
<%
    String action = request.getParameter("action");
    CalendarAssignmentService service = new CalendarAssignmentService();
    String jsonResponse = "";

    try {
        if ("loadAll".equals(action)) {
            // Carica tutte le assegnazioni dal file JSON
            List<Assignment> assignments = service.readAllAssignments();
            org.json.JSONArray jsonArray = new org.json.JSONArray();

            // Convertiamo la lista di Assignment in JSON
            for (Assignment a : assignments) {
                org.json.JSONObject obj = new org.json.JSONObject();
                obj.put("date", a.getDate() != null ? a.getDate().toString() : "");
                obj.put("personName", a.getPersonName() != null ? a.getPersonName() : "");
                obj.put("color", a.getColor() != null ? a.getColor() : "");
                jsonArray.put(obj);
            }
            jsonResponse = jsonArray.toString(4);

        } else if ("assign".equals(action)) {
            // Assegna un utente a una data
            String dateStr = request.getParameter("date");
            String personName = request.getParameter("person");
            String color = request.getParameter("color");

            if (dateStr != null && personName != null && color != null) {
                LocalDate date = LocalDate.parse(dateStr);
                service.assignDay(date, personName, color);

                org.json.JSONObject obj = new org.json.JSONObject();
                obj.put("status", "OK");
                obj.put("message", "Assegnazione salvata correttamente.");
                jsonResponse = obj.toString(4);
            } else {
                org.json.JSONObject obj = new org.json.JSONObject();
                obj.put("status", "ERROR");
                obj.put("message", "Parametri mancanti per l'assegnazione.");
                jsonResponse = obj.toString(4);
            }

        } else if ("remove".equals(action)) {
            // Rimuove l'assegnazione per una data
            String dateStr = request.getParameter("date");
            if (dateStr != null) {
                LocalDate date = LocalDate.parse(dateStr);
                service.removeAssignment(date);

                org.json.JSONObject obj = new org.json.JSONObject();
                obj.put("status", "OK");
                obj.put("message", "Assegnazione rimossa correttamente.");
                jsonResponse = obj.toString(4);
            } else {
                org.json.JSONObject obj = new org.json.JSONObject();
                obj.put("status", "ERROR");
                obj.put("message", "Data non specificata per la rimozione.");
                jsonResponse = obj.toString(4);
            }

        } else {
            // Azione non riconosciuta
            org.json.JSONObject obj = new org.json.JSONObject();
            obj.put("status", "ERROR");
            obj.put("message", "Azione non riconosciuta.");
            jsonResponse = obj.toString(4);
        }

    } catch(Exception e) {
        // Eccezione generica
        org.json.JSONObject obj = new org.json.JSONObject();
        obj.put("status", "ERROR");
        obj.put("message", "Eccezione: " + e.getMessage());
        jsonResponse = obj.toString(4);
    }

    // Stampa la risposta JSON
    out.print(jsonResponse);
%>


