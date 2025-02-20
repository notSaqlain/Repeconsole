package com.unipol.repeapp.model;

public class CalendarEvent {
    private String date;
    private String personName;
    private String color;

    public CalendarEvent() {
    }

    public CalendarEvent(String date, String personName, String color) {
        this.date = date;
        this.personName = personName;
        this.color = color;
    }

    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }
    
    public String getPersonName() {
        return personName;
    }
    public void setPersonName(String personName) {
        this.personName = personName;
    }
    
    public String getColor() {
        return color;
    }
    public void setColor(String color) {
        this.color = color;
    }
}
