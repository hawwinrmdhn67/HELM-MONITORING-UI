#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <math.h>

const char* ssid = "Anzu - NET";
const char* password = "hawwin67";
const char* serverUrl = "http://192.168.1.106:3001/api/update-location";

#define MPU6050_ADDR 0x68
int16_t ax, ay, az;
float total_acceleration;
float pitch = 0.0;
float roll = 0.0;

#define BUZZER 15
#define RESET_PIN 13 

const float CRASH_THRESHOLD = 2.5; 
const unsigned long BUZZER_DURATION = 10000UL;        
const unsigned long SEND_INTERVAL = 2000UL;          
const unsigned long INCIDENT_AUTO_CLEAR = BUZZER_DURATION;

unsigned long crashStart = 0;
unsigned long incidentStart = 0;
unsigned long lastSend = 0;

bool buzzerActive = false;     
bool incidentActive = false;   

unsigned long lastResetPress = 0;
const unsigned long RESET_DEBOUNCE = 50UL;

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER, OUTPUT);
  pinMode(RESET_PIN, INPUT_PULLUP); 

  WiFi.begin(ssid, password);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) { 
    delay(500); Serial.print(".");
  }
  Serial.println("\nWi-Fi connected!");

  Wire.begin();
  Wire.beginTransmission(MPU6050_ADDR);
  Wire.write(0x6B); 
  Wire.write(0); 
  Wire.endTransmission(true);
  delay(100);
}

bool checkResetButton() {
  if (digitalRead(RESET_PIN) == LOW) {
    unsigned long now = millis();
    if (now - lastResetPress > RESET_DEBOUNCE) {
      lastResetPress = now;
      delay(20);
      if (digitalRead(RESET_PIN) == LOW) {
        return true;
      }
    }
  }
  return false;
}

void loop() {
  readMPU6050();
  
  total_acceleration = sqrt((float)ax*(float)ax + (float)ay*(float)ay + (float)az*(float)az) / 16384.0;
  if (isnan(total_acceleration)) total_acceleration = 0.0;

  pitch = atan2((float)ay, sqrt((float)ax*(float)ax + (float)az*(float)az)) * 180.0 / PI;
  roll  = atan2(-(float)ax, (float)az) * 180.0 / PI;

  Serial.printf("Acc=%.2f g, Pitch=%.2f, Roll=%.2f\n", total_acceleration, pitch, roll);

  if (checkResetButton()) {
    Serial.println("🛠 Manual reset pressed -> clearing incident");
    clearIncident();
  }

  if (total_acceleration >= CRASH_THRESHOLD && !incidentActive) {
    incidentActive = true;
    buzzerActive = true;
    crashStart = millis();
    incidentStart = crashStart;

    tone(BUZZER, 2000);
    Serial.printf("Incident detected! acc=%.2f g\n", total_acceleration);
    sendIncidentImmediate(total_acceleration, true);
  }

  if (buzzerActive && millis() - crashStart >= BUZZER_DURATION) {
    buzzerActive = false;
    noTone(BUZZER);
    Serial.println("Buzzer stopped");
  }

  if (incidentActive && (millis() - incidentStart >= INCIDENT_AUTO_CLEAR)) {
    Serial.println("Clearing incident (after buzzer duration)");
    clearIncident();
  }

  if (millis() - lastSend >= SEND_INTERVAL) {
    lastSend = millis();
    sendIncident(total_acceleration, incidentActive);
  }

  delay(50); 
}

void clearIncident() {
  incidentActive = false;
  buzzerActive = false;
  noTone(BUZZER);
  sendIncidentImmediate(total_acceleration, false);
}

void sendIncidentImmediate(float acc, bool isIncident) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type","application/json");

    String payload = "{";
    payload += "\"helmet_id\":\"H01\",";
    payload += "\"acceleration\":" + String(acc, 2) + ",";
    payload += "\"helm_status\":\"" + String(isIncident ? "ALERT" : "On") + "\",";
    payload += "\"incident\":" + String(isIncident ? "true" : "false") + ",";
    payload += "\"pitch\":" + String(pitch, 2) + ",";
    payload += "\"roll\":" + String(roll, 2) + ",";
    payload += "\"source\":\"Arduino\"";
    payload += "}";

    int code = http.POST(payload);
    if (code > 0) {
      Serial.print("Send OK. Code: ");
      Serial.println(code);
    } else {
      Serial.println("Send failed");
    }
    http.end();
  } else {
    Serial.println("WiFi disconnected");
    WiFi.reconnect();
  }
}

void sendIncident(float acc, bool isIncident) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type","application/json");

    String payload = "{";
    payload += "\"helmet_id\":\"H01\",";
    payload += "\"acceleration\":" + String(acc, 2) + ",";
    payload += "\"helm_status\":\"" + String(isIncident ? "ALERT" : "On") + "\",";
    payload += "\"incident\":" + String(isIncident ? "true" : "false") + ",";
    payload += "\"pitch\":" + String(pitch, 2) + ",";
    payload += "\"roll\":" + String(roll, 2) + ",";
    payload += "\"source\":\"Arduino\"";
    payload += "}";

    int code = http.POST(payload);
    if (code > 0) {
      Serial.print("Send OK. Code: ");
      Serial.println(code);
    } else {
      Serial.println("Send failed");
    }
    http.end();
  } else {
    Serial.println("WiFi disconnected");
    WiFi.reconnect();
  }
}

void readMPU6050() {
  Wire.beginTransmission(MPU6050_ADDR);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU6050_ADDR, 6, true);
  ax = Wire.read() << 8 | Wire.read();
  ay = Wire.read() << 8 | Wire.read();
  az = Wire.read() << 8 | Wire.read();
}

