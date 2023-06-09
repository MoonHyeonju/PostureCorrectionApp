package com.example.posturecorrectionapp;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface RetrofitInterface {
    @GET("/posts")
    Call<List<POST>> getData(@Query("memberId") String id);
}
