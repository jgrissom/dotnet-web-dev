namespace Roster.Web.Models;

// The course catalog, hard-coded for now. In week 7 this becomes a database
// table and this file goes away — the controller code barely changes.
public static class CourseData
{
    public static List<Course> All { get; } = new()
    {
        new Course { Id = 1, Code = "CS 101", Title = "Intro to Programming",   Credits = 4, Instructor = "Alvarez" },
        new Course { Id = 2, Code = "CS 210", Title = "Web Development",        Credits = 3, Instructor = "Grissom" },
        new Course { Id = 3, Code = "CS 240", Title = "Database Design",        Credits = 3, Instructor = "Okafor"  },
        new Course { Id = 4, Code = "MA 150", Title = "Discrete Mathematics",   Credits = 4, Instructor = "Bergman" },
        new Course { Id = 5, Code = "CS 299", Title = "Software Capstone",      Credits = 2, Instructor = "Lindqvist" },
    };
}
