package com.example.posturecorrectionapp;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;
import retrofit2.http.Path;
public class RetrofitClient {

    private static final String BASE_URL = "localhost:8081";

    public static RetrofitInterface getApiService() {return getInstance().create(RetrofitInterface.class);}

    private static Retrofit getInstance() {
        Gson gson = new GsonBuilder().setLenient().create();
        return new Retrofit.Builder()
                .baseUrl(BASE_URL).addConverterFactory(GsonConverterFactory.create(gson)).build();
    }
}
