namespace Roster.Web.Models;

public class Course
{
    public int Id { get; set; }
    public string Code { get; set; } = "";
    public string Title { get; set; } = "";
    public int Credits { get; set; }
    public string Instructor { get; set; } = "";
}
