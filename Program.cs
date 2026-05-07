using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using GraphTicTacToeCoach;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddSingleton<GraphTicTacToeCoach.Services.TicTacToeEngine>();
builder.Services.AddSingleton<GraphTicTacToeCoach.Services.EulerService>();

await builder.Build().RunAsync();
