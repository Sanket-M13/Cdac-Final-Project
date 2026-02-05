using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using EVChargerAPI.Data;
using EVChargerAPI.Models;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "your-secret-key-here"))
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();


using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    context.Database.EnsureCreated();
    
   
    if (!context.Users.Any(u => u.Email == "admin@evcharger.com"))
    {
        var adminUser = new User
        {
            Email = "admin@evcharger.com",
            Name = "Admin User",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = "Admin"
        };
        context.Users.Add(adminUser);
        context.SaveChanges();
    }
    
   
    if (!context.VehicleBrands.Any())
    {
        var carBrands = new[]
        {
            new VehicleBrand { Name = "Tata", Type = "Car" },
            new VehicleBrand { Name = "Mahindra", Type = "Car" },
            new VehicleBrand { Name = "MG", Type = "Car" },
            new VehicleBrand { Name = "Hyundai", Type = "Car" },
            new VehicleBrand { Name = "Kia", Type = "Car" },
            new VehicleBrand { Name = "BYD", Type = "Car" },
            new VehicleBrand { Name = "Ather", Type = "Bike" },
            new VehicleBrand { Name = "Ola Electric", Type = "Bike" },
            new VehicleBrand { Name = "TVS", Type = "Bike" },
            new VehicleBrand { Name = "Bajaj", Type = "Bike" },
            new VehicleBrand { Name = "Hero Electric", Type = "Bike" }
        };
        
        context.VehicleBrands.AddRange(carBrands);
        context.SaveChanges();
        
 
        var models = new[]
        {
            new VehicleModel { Name = "Nexon EV", VehicleBrandId = 1 },
            new VehicleModel { Name = "Tigor EV", VehicleBrandId = 1 },
            new VehicleModel { Name = "Tiago EV", VehicleBrandId = 1 },
            new VehicleModel { Name = "XUV400", VehicleBrandId = 2 },
            new VehicleModel { Name = "eVerito", VehicleBrandId = 2 },
            new VehicleModel { Name = "ZS EV", VehicleBrandId = 3 },
            new VehicleModel { Name = "Comet EV", VehicleBrandId = 3 },
            new VehicleModel { Name = "Kona Electric", VehicleBrandId = 4 },
            new VehicleModel { Name = "Ioniq 5", VehicleBrandId = 4 },
            new VehicleModel { Name = "EV6", VehicleBrandId = 5 },
            new VehicleModel { Name = "Atto 3", VehicleBrandId = 6 },
            new VehicleModel { Name = "450X", VehicleBrandId = 7 },
            new VehicleModel { Name = "450 Plus", VehicleBrandId = 7 },
            new VehicleModel { Name = "S1 Pro", VehicleBrandId = 8 },
            new VehicleModel { Name = "S1 Air", VehicleBrandId = 8 },
            new VehicleModel { Name = "iQube", VehicleBrandId = 9 },
            new VehicleModel { Name = "Chetak", VehicleBrandId = 10 },
            new VehicleModel { Name = "Photon", VehicleBrandId = 11 },
            new VehicleModel { Name = "Optima", VehicleBrandId = 11 }
        };
        
        context.VehicleModels.AddRange(models);
        context.SaveChanges();
    }
    
    if (!context.Stations.Any())
    {
        context.Stations.AddRange(
            new Station
            {
                Name = "Central Mall Charging Hub",
                Address = "123 Main Street, Satara",
                Latitude = 17.6868,
                Longitude = 74.0180,
                ConnectorTypes = "[\"Type 2\", \"CCS\"]",
                PowerOutput = "50kW",
                PricePerKwh = 8.5m,
                Amenities = "[\"Parking\", \"Restroom\", \"Cafe\"]",
                OperatingHours = "24/7",
                Status = "Available",
                TotalSlots = 4,
                AvailableSlots = 0
            },
            new Station
            {
                Name = "Tech Park Fast Charger",
                Address = "456 Tech Avenue, Satara",
                Latitude = 17.6950,
                Longitude = 74.0250,
                ConnectorTypes = "[\"CCS\", \"CHAdeMO\"]",
                PowerOutput = "150kW",
                PricePerKwh = 12.0m,
                Amenities = "[\"Parking\", \"Security\"]",
                OperatingHours = "6:00 AM - 10:00 PM",
                Status = "Available",
                ApprovalStatus = "Pending",
                TotalSlots = 6,
                AvailableSlots = 4
            },
            new Station
            {
                Name = "Highway Express Charger",
                Address = "789 Highway Road, Satara",
                Latitude = 17.7000,
                Longitude = 74.0300,
                ConnectorTypes = "[\"Type 2\", \"CCS\", \"CHAdeMO\"]",
                PowerOutput = "120kW",
                PricePerKwh = 10.5m,
                Amenities = "[\"Parking\", \"Restroom\", \"Food Court\"]",
                OperatingHours = "24/7",
                Status = "Available",
                TotalSlots = 8,
                AvailableSlots = 6
            },
            new Station
            {
                Name = "City Center Quick Charge",
                Address = "321 City Center, Satara",
                Latitude = 17.6800,
                Longitude = 74.0150,
                ConnectorTypes = "[\"Type 2\", \"CCS\"]",
                PowerOutput = "75kW",
                PricePerKwh = 9.0m,
                Amenities = "[\"Parking\", \"Shopping\"]",
                OperatingHours = "8:00 AM - 11:00 PM",
                Status = "Available",
                TotalSlots = 3,
                AvailableSlots = 2
            },
            new Station
            {
                Name = "Green Energy Station",
                Address = "654 Green Valley, Satara",
                Latitude = 17.6750,
                Longitude = 74.0100,
                ConnectorTypes = "[\"Type 2\", \"CCS\"]",
                PowerOutput = "60kW",
                PricePerKwh = 7.5m,
                Amenities = "[\"Parking\", \"Garden\", \"Restroom\"]",
                OperatingHours = "6:00 AM - 9:00 PM",
                Status = "Available",
                TotalSlots = 5,
                AvailableSlots = 3
            },
            new Station
            {
                Name = "Airport Charging Plaza",
                Address = "987 Airport Road, Satara",
                Latitude = 17.7100,
                Longitude = 74.0400,
                ConnectorTypes = "[\"Type 2\", \"CCS\", \"CHAdeMO\"]",
                PowerOutput = "180kW",
                PricePerKwh = 15.0m,
                Amenities = "[\"Parking\", \"Lounge\", \"WiFi\"]",
                OperatingHours = "24/7",
                Status = "Available",
                TotalSlots = 10,
                AvailableSlots = 8
            },
            new Station
            {
                Name = "Residential Complex Charger",
                Address = "147 Residential Area, Satara",
                Latitude = 17.6900,
                Longitude = 74.0200,
                ConnectorTypes = "[\"Type 2\"]",
                PowerOutput = "22kW",
                PricePerKwh = 6.0m,
                Amenities = "[\"Parking\", \"Security\"]",
                OperatingHours = "24/7",
                Status = "Available",
                TotalSlots = 2,
                AvailableSlots = 1
            },
            new Station
            {
                Name = "Tata Power Super Charger Koregaon Park",
                Address = "258 Koregaon Park, Pune",
                Latitude = 18.5362,
                Longitude = 73.8980,
                ConnectorTypes = "[\"CCS\", \"CHAdeMO\"]",
                PowerOutput = "200kW",
                PricePerKwh = 14.0m,
                Amenities = "[\"Parking\", \"Cafe\", \"WiFi\"]",
                OperatingHours = "24/7",
                Status = "Available",
                TotalSlots = 12,
                AvailableSlots = 9
            },
           
            new Station
            {
                Name = "Nanded Railway Station Charging Hub",
                Address = "Railway Station Road, Nanded, Maharashtra 431602",
                Latitude = 19.1383,
                Longitude = 77.3210,
                ConnectorTypes = "[\"Type 2\", \"CCS\", \"CHAdeMO\"]",
                PowerOutput = "120kW",
                PricePerKwh = 11.0m,
                Amenities = "[\"Parking\", \"Restroom\", \"Food Court\", \"WiFi\"]",
                OperatingHours = "24/7",
                Status = "Available",
                TotalSlots = 8,
                AvailableSlots = 6
            },
            new Station
            {
                Name = "Mahur Road Fast Charger",
                Address = "Mahur Road, Near MIDC, Nanded, Maharashtra 431603",
                Latitude = 19.1520,
                Longitude = 77.2980,
                ConnectorTypes = "[\"CCS\", \"Type 2\"]",
                PowerOutput = "60kW",
                PricePerKwh = 9.5m,
                Amenities = "[\"Parking\", \"Security\", \"Restroom\"]",
                OperatingHours = "6:00 AM - 10:00 PM",
                Status = "Available",
                TotalSlots = 4,
                AvailableSlots = 3
            },
            new Station
            {
                Name = "Shri Guru Gobind Singh College Charging Point",
                Address = "Vishnupuri, Nanded, Maharashtra 431606",
                Latitude = 19.1650,
                Longitude = 77.2850,
                ConnectorTypes = "[\"Type 2\", \"CCS\"]",
                PowerOutput = "50kW",
                PricePerKwh = 8.0m,
                Amenities = "[\"Parking\", \"Campus Access\", \"Security\"]",
                OperatingHours = "7:00 AM - 9:00 PM",
                Status = "Available",
                TotalSlots = 6,
                AvailableSlots = 4
            },
            new Station
            {
                Name = "Nanded City Mall EV Hub",
                Address = "Shivaji Nagar, Nanded, Maharashtra 431605",
                Latitude = 19.1480,
                Longitude = 77.3150,
                ConnectorTypes = "[\"Type 2\", \"CCS\"]",
                PowerOutput = "75kW",
                PricePerKwh = 10.0m,
                Amenities = "[\"Parking\", \"Shopping\", \"Food Court\", \"Cinema\"]",
                OperatingHours = "10:00 AM - 11:00 PM",
                Status = "Available",
                TotalSlots = 5,
                AvailableSlots = 3
            },
            new Station
            {
                Name = "Hazur Sahib Gurudwara Charging Station",
                Address = "Near Takht Sachkhand Sri Hazur Sahib, Nanded, Maharashtra 431602",
                Latitude = 19.1420,
                Longitude = 77.2950,
                ConnectorTypes = "[\"Type 2\", \"CCS\"]",
                PowerOutput = "40kW",
                PricePerKwh = 7.5m,
                Amenities = "[\"Parking\", \"Religious Site\", \"Restroom\", \"Langar\"]",
                OperatingHours = "5:00 AM - 10:00 PM",
                Status = "Available",
                TotalSlots = 4,
                AvailableSlots = 2
            },
            new Station
            {
                Name = "Nanded Airport EV Charging",
                Address = "Airport Road, Nanded, Maharashtra 431605",
                Latitude = 19.1830,
                Longitude = 77.3180,
                ConnectorTypes = "[\"Type 2\", \"CCS\", \"CHAdeMO\"]",
                PowerOutput = "150kW",
                PricePerKwh = 13.0m,
                Amenities = "[\"Parking\", \"Airport Access\", \"WiFi\", \"Lounge\"]",
                OperatingHours = "24/7",
                Status = "Available",
                TotalSlots = 6,
                AvailableSlots = 5
            },
            new Station
            {
                Name = "Godavari Bridge Charging Point",
                Address = "Near Godavari Bridge, Nanded-Latur Highway, Nanded, Maharashtra",
                Latitude = 19.1250,
                Longitude = 77.3350,
                ConnectorTypes = "[\"CCS\", \"Type 2\"]",
                PowerOutput = "80kW",
                PricePerKwh = 9.0m,
                Amenities = "[\"Parking\", \"Highway Access\", \"Restroom\"]",
                OperatingHours = "24/7",
                Status = "Available",
                TotalSlots = 3,
                AvailableSlots = 2
            },
            new Station
            {
                Name = "SRTMU University Charging Hub",
                Address = "Swami Ramanand Teerth Marathwada University, Nanded, Maharashtra 431606",
                Latitude = 19.1680,
                Longitude = 77.2750,
                ConnectorTypes = "[\"Type 2\", \"CCS\"]",
                PowerOutput = "45kW",
                PricePerKwh = 7.0m,
                Amenities = "[\"Parking\", \"University Campus\", \"Library Access\", \"Canteen\"]",
                OperatingHours = "6:00 AM - 8:00 PM",
                Status = "Available",
                TotalSlots = 4,
                AvailableSlots = 3
            },
            new Station
            {
                Name = "Nanded Bus Stand EV Point",
                Address = "Central Bus Stand, Station Road, Nanded, Maharashtra 431602",
                Latitude = 19.1400,
                Longitude = 77.3180,
                ConnectorTypes = "[\"Type 2\", \"CCS\"]",
                PowerOutput = "60kW",
                PricePerKwh = 8.5m,
                Amenities = "[\"Parking\", \"Bus Terminal\", \"Restroom\", \"Food Stalls\"]",
                OperatingHours = "5:00 AM - 11:00 PM",
                Status = "Available",
                TotalSlots = 5,
                AvailableSlots = 4
            },
            new Station
            {
                Name = "Kandhar Road Charging Station",
                Address = "Kandhar Road, Near Petrol Pump, Nanded, Maharashtra 431602",
                Latitude = 19.1550,
                Longitude = 77.3050,
                ConnectorTypes = "[\"CCS\", \"Type 2\"]",
                PowerOutput = "50kW",
                PricePerKwh = 8.0m,
                Amenities = "[\"Parking\", \"Fuel Station\", \"Convenience Store\"]",
                OperatingHours = "6:00 AM - 10:00 PM",
                Status = "Available",
                TotalSlots = 3,
                AvailableSlots = 2
            }
        );
        context.SaveChanges();
    }
}

app.Run();