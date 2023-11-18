package com.PipoDB.straviatecmobileapp;


import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.content.Context;
import android.content.pm.PackageManager;

import androidx.annotation.NonNull;

import androidx.fragment.app.FragmentActivity;

import android.location.Location;
//import android.location.LocationRequest;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Looper;
import android.os.PowerManager;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Chronometer;
import android.widget.FrameLayout;
import android.Manifest;
import android.widget.TextView;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationAvailability;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;

import java.io.File;
import java.io.FileWriter;


import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import java.io.IOException;
import java.util.ArrayList;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback, LocationListener {

    GoogleMap gMap;
    FrameLayout map;
    Polyline route;
    FusedLocationProviderClient fusedLocationClient;
    LocationRequest request;
    LocationCallback locationCallback;
    LocationResult locationResult;
    private LocationManager locationManager;
    private ArrayList<LatLng> locationList = new ArrayList<LatLng>();

    double latitude, longitude;

    Chronometer chronometer;
    private long pauseOffset;
    private boolean isChronometerRunning = false;
    private boolean isServiceBound = false;


    //private TextView countdownTextView;

    Button startTimer;
    Button stopTimer;
    Button exportGPX;


    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;


    @RequiresApi(api = Build.VERSION_CODES.R)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.MANAGE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {

        } else {
            // You need to request permissions.
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, LOCATION_PERMISSION_REQUEST_CODE);
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, LOCATION_PERMISSION_REQUEST_CODE);
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, LOCATION_PERMISSION_REQUEST_CODE);
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.MANAGE_EXTERNAL_STORAGE}, LOCATION_PERMISSION_REQUEST_CODE);
        }

        // You have the required permissions.
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        locationCallback = new LocationCallback() {
            @Override
            public void onLocationAvailability(@NonNull LocationAvailability locationAvailability) {
                super.onLocationAvailability(locationAvailability);
            }

            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult == null) {
                    return;
                }
                for (Location location : locationResult.getLocations()) {
                    // Handle the new location data
                    MapsActivity.this.latitude = location.getLatitude();
                    MapsActivity.this.longitude = location.getLongitude();
                    Log.d("PolyLines", "Updating map...");

                    LatLng mapCurrent = new LatLng(MapsActivity.this.latitude, MapsActivity.this.longitude);

                    double bottomBoundary = mapCurrent.latitude - 0.0001;
                    double leftBoundary = mapCurrent.longitude - 0.0001;
                    double topBoundary = mapCurrent.latitude + 0.0001;
                    double rightBoundary = mapCurrent.longitude + 0.0001;

                    LatLngBounds cameraBoundary = new LatLngBounds(new LatLng(bottomBoundary, leftBoundary), new LatLng(topBoundary, rightBoundary));
                    MapsActivity.this.gMap.moveCamera(CameraUpdateFactory.newLatLngBounds(cameraBoundary, 10));
                    Log.d("PolyLines", "creating polyline");
                    MapsActivity.this.route = MapsActivity.this.gMap.addPolyline(new PolylineOptions().clickable(false).addAll(locationList));
                    Log.d("PolyLines", "added polyline");
                }
            }
        };

        request = createRequest();

        fusedLocationClient.getLastLocation().addOnSuccessListener(this, location -> {
            if (location != null) {
                latitude = location.getLatitude();
                longitude = location.getLongitude();
                Log.d("Location", "location retrieved");
                Log.d("latitude", String.valueOf(latitude));
                Log.d("longitude", String.valueOf(longitude));
                //fusedLocationClient.requestLocationUpdates(request);
                this.setLocationMarker();
                //location.
            } else {
                Log.d("Location", "couldnt get location");
            }
        });


        map = findViewById(R.id.map);
        startTimer = findViewById(R.id.Start);
        stopTimer = findViewById(R.id.Stop);
        exportGPX = findViewById(R.id.ExportGPX);


        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);



        startTimer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if (!isChronometerRunning) {
                    Log.d("Timer", "Starting Timer....");
                    startChronometer(view);
                    startTimer.setText("Pause Timer");
                    locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
                    if (ActivityCompat.checkSelfPermission(MapsActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(MapsActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                        // TODO: Consider calling
                        //    ActivityCompat#requestPermissions
                        // here to request the missing permissions, and then overriding
                        //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                        //                                          int[] grantResults)
                        // to handle the case where the user grants the permission. See the documentation
                        // for ActivityCompat#requestPermissions for more details.
                        return;
                    }
                    locationManager.requestLocationUpdates(
                            LocationManager.GPS_PROVIDER,
                            500L,   // Minimum time interval between updates (in milliseconds)
                            2F,     // Minimum distance between updates (in meters)
                            (LocationListener) MapsActivity.this);  // LocationListener
                    Log.d("Timer", "Timer Started");
                }else{
                    Log.d("Timer", "Pausing....");
                    pauseChronometer(view);
                    startTimer.setText("Start Timer");
                }





            }
        });


        stopTimer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                Log.d("Timer", "Stoping Timer....");
                resetChronometer(view);
                locationManager.removeUpdates((LocationListener) MapsActivity.this);
                //fusedLocationClient.removeLocationUpdates(locationCallback);

                Log.d("Timer", "Timer Stopped");


            }
        });


        exportGPX.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                Log.d("ExportGPX", "Exporting File...");
                createGpxFile(locationList,"GPX1");

                Log.d("Timer", "Timer Stopped");


            }
        });





        chronometer = findViewById(R.id.chronometer);
        //elapsedTimeTextView = findViewById(R.id.elapsedTimeTextView);

        chronometer.setOnChronometerTickListener(chronometer -> updateElapsedTime());

        // Set the format to display seconds only
        chronometer.setFormat("00:%s");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (locationManager != null) {
            locationManager.removeUpdates(this);
        }
    }

    @Override
    public void onMapReady(@NonNull GoogleMap googleMap) {
        this.gMap = googleMap;
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED

        ) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        gMap.setMyLocationEnabled(true);
        gMap.getUiSettings().setMyLocationButtonEnabled(true);
        gMap.setOnMyLocationButtonClickListener(null);
        gMap.setOnMyLocationClickListener(null);

    }



   /* public int exportGPX() {

        String gpxData = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>"
                + "<gpx version=\"1.1\" xmlns=\"http://www.topografix.com/GPX/1/1\">"
                + "<wpt lat=\"37.7749\" lon=\"-122.4194\">"
                + "<name>San Francisco</name>"
                + "<desc>City by the Bay</desc>"
                + "</wpt>"
                + "</gpx>";
        Log.d("GPX", "creating .gpx ....");
        try {
            FileWriter writer = new FileWriter("/storage/self/primary/GPXFiles/GPXTEST.gpx");
            writer.write(gpxData);
            writer.close();
            Log.d("GPX", "created!");
            return 1;

        } catch (Exception e) {
            Log.d("GPX", "Failed creating gpx");
            throw new RuntimeException(e);
        }
    }

*/

    public static void createGpxFile(ArrayList<LatLng> routeCoordinates, String fileName) {
        try {
            // Create a GPX file
            File gpxFile = new File(Environment.getExternalStorageDirectory(), fileName + ".gpx");
            FileWriter writer = new FileWriter(gpxFile);

            // Write GPX header
            writer.write("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n");
            writer.write("<gpx version=\"1.1\" xmlns=\"http://www.topografix.com/GPX/1/1\">\n");
            writer.write("  <trk>\n");
            writer.write("    <name>" + fileName + "</name>\n");
            writer.write("    <trkseg>\n");

            // Write coordinates
            for (LatLng coordinate : routeCoordinates) {
                writer.write("      <trkpt lat=\"" + coordinate.latitude + "\" lon=\"" + coordinate.longitude + "\">\n");
                writer.write("      </trkpt>\n");
            }

            // Write GPX footer
            writer.write("    </trkseg>\n");
            writer.write("  </trk>\n");
            writer.write("</gpx>");

            // Close the file
            writer.close();

            Log.d("GPX", "GPX file created: " + gpxFile.getAbsolutePath());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    public void setLocationMarker() {
        LatLng mapCurrent = new LatLng(this.latitude, this.longitude);

        double bottomBoundary = mapCurrent.latitude - 0.001;
        double leftBoundary = mapCurrent.longitude - 0.001;
        double topBoundary = mapCurrent.latitude + 0.001;
        double rightBoundary = mapCurrent.longitude + 0.001;

        LatLngBounds cameraBoundary = new LatLngBounds(new LatLng(bottomBoundary, leftBoundary), new LatLng(topBoundary, rightBoundary));
        this.gMap.addMarker(new MarkerOptions().position(mapCurrent).title("Start Position"));
        this.gMap.moveCamera(CameraUpdateFactory.newLatLngBounds(cameraBoundary, 10));
    }

    public LocationRequest createRequest() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            LocationRequest locationRequest = new LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY).setDurationMillis((long) 500.0).build();
            return locationRequest;
        } else {
            return null;
        }

    }


    public void startChronometer(View view) {
        if (!isChronometerRunning) {
            chronometer.setBase(SystemClock.elapsedRealtime() - pauseOffset);
            chronometer.start();
            isChronometerRunning = true;
        }
    }

    public void pauseChronometer(View view) {
        if (isChronometerRunning) {
            chronometer.stop();
            pauseOffset = SystemClock.elapsedRealtime() - chronometer.getBase();
            isChronometerRunning = false;
        }
    }

    public void resetChronometer(View view) {
        chronometer.stop();
        chronometer.setBase(SystemClock.elapsedRealtime());
        pauseOffset = 0;
        isChronometerRunning = false;
        updateElapsedTime();
    }

    private void updateElapsedTime() {
        long elapsedMillis = SystemClock.elapsedRealtime() - chronometer.getBase();
        int seconds = (int) (elapsedMillis / 1000);
        String elapsedTimeFormatted = String.format("Elapsed Time: %02d:%02d", seconds / 60, seconds % 60);
        //elapsedTimeTextView.setText(elapsedTimeFormatted);
    }


    @Override
    public void onLocationChanged(@NonNull Location location) {

        /*PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "StraviaTEC:LocationUpdatesWakelock");
        wakeLock.acquire();*/

        this.latitude = location.getLatitude();
        this.longitude = location.getLongitude();
        //LatLng temp = new LatLng(latitude,longitude);

        //location.get
        locationList.add(new LatLng(this.latitude,this.longitude));
        updateMap();
        //wakeLock.release();

    }

    public void updateMap(){
        Log.d("PolyLines","Updating map...");

        LatLng mapCurrent = new LatLng(this.latitude, this.longitude);

        double bottomBoundary = mapCurrent.latitude - 0.0001;
        double leftBoundary = mapCurrent.longitude - 0.0001;
        double topBoundary = mapCurrent.latitude + 0.0001;
        double rightBoundary = mapCurrent.longitude + 0.0001;

        LatLngBounds cameraBoundary = new LatLngBounds(new LatLng(bottomBoundary, leftBoundary), new LatLng(topBoundary, rightBoundary));
        //this.gMap.addMarker(new MarkerOptions().position(mapCurrent).title("Start Position"));
        this.gMap.moveCamera(CameraUpdateFactory.newLatLngBounds(cameraBoundary, 10));
        Log.d("PolyLines","creating polyline");
        /*if(this.route != null){
            this.route.remove();
        }*/
        this.route = this.gMap.addPolyline(new PolylineOptions().clickable(false).addAll(locationList));
        Log.d("PolyLines","added polyline");
        //this.route.get;
    }
}