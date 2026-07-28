// ═══════════════════════════════════════════════════════════════════
//  READ-ONLY — these are the checks your lab is graded against.
//  Run them with:  dotnet test Roster.Checks   (from the parent folder)
//  Your job is turning ❌ into ✅ by editing Roster.Web — never this file.
// ═══════════════════════════════════════════════════════════════════
using Microsoft.AspNetCore.Mvc.Testing;
using Roster.Web.Models;

namespace Roster.Checks;

public class CourseChecks : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public CourseChecks(WebApplicationFactory<Program> factory)
        => _client = factory.CreateClient();

    [Fact] // passes out of the box — proves the harness works
    public async Task Check1_HomePageLoads()
    {
        var response = await _client.GetAsync("/");
        Assert.True(response.IsSuccessStatusCode, "GET / should return 200");
    }

    [Fact] // Task 2: add a CoursesController with an Index action + view
    public async Task Check2_CoursesPageExists()
    {
        var response = await _client.GetAsync("/Courses");
        Assert.True(response.IsSuccessStatusCode,
            "GET /Courses should return 200 — you need Controllers/CoursesController.cs AND Views/Courses/Index.cshtml");
    }

    [Fact] // Task 3: the Index view lists every seeded course
    public async Task Check3_IndexListsEveryCourse()
    {
        var html = await _client.GetStringAsync("/Courses");
        foreach (var course in CourseData.All)
        {
            Assert.True(html.Contains(course.Title),
                $"/Courses is missing \"{course.Title}\" — loop over the whole list with @foreach");
        }
    }

    [Fact] // Task 4: Details shows the ONE course whose id is in the URL
    public async Task Check4_DetailsShowsOneCourse()
    {
        var response = await _client.GetAsync("/Courses/Details/2");
        Assert.True(response.IsSuccessStatusCode, "GET /Courses/Details/2 should return 200");

        var html = await response.Content.ReadAsStringAsync();
        Assert.Contains("Web Development", html);   // course 2's title
        Assert.Contains("CS 210", html);            // ...and its code
        Assert.DoesNotContain("Discrete Mathematics", html);  // but NOT the whole list
    }

    [Fact] // Task 5: an id nobody has must 404 — not crash, not show a blank page
    public async Task Check5_BadIdIsNotFound()
    {
        // a real id has to work first, or "404" would just mean "no controller yet"
        var good = await _client.GetAsync("/Courses/Details/1");
        Assert.True(good.IsSuccessStatusCode, "GET /Courses/Details/1 should return 200 (check 4 first)");

        var bad = await _client.GetAsync("/Courses/Details/999");
        Assert.Equal(System.Net.HttpStatusCode.NotFound, bad.StatusCode);
    }

    [Fact] // Task 6: each row on Index links to its own Details page
    public async Task Check6_IndexLinksToDetails()
    {
        var html = await _client.GetStringAsync("/Courses");
        Assert.Contains("/Courses/Details/1", html);
    }
}
