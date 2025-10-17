import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, BookOpen, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { courses, Course } from "@/data/courses";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!id || !session) return;

    loadCourseProgress();
  }, [id, session]);

  const loadCourseProgress = async () => {
    if (!id || !session) return;

    setLoading(true);
    const baseCourse = courses.find((c) => c.id === id);
    if (!baseCourse) {
      setLoading(false);
      return;
    }

    try {
      // Fetch user's progress for this course
      const { data: progressData, error } = await supabase
        .from("user_course_progress")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("course_id", id);

      if (error) throw error;

      // Merge progress with course data
      const lessonsWithProgress = baseCourse.lessons.map((lesson) => {
        const progress = progressData?.find((p) => p.lesson_id === lesson.id);
        return {
          ...lesson,
          completed: progress?.completed || false,
        };
      });

      setCourse({
        ...baseCourse,
        lessons: lessonsWithProgress,
      });
    } catch (error) {
      console.error("Error loading progress:", error);
      toast.error("Failed to load your progress");
      setCourse(baseCourse);
    } finally {
      setLoading(false);
    }
  };

  const toggleLesson = async (lessonId: string) => {
    if (!course || !session) return;

    const lesson = course.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    const newCompletedStatus = !lesson.completed;

    // Optimistic update
    const updatedCourse = {
      ...course,
      lessons: course.lessons.map((l) =>
        l.id === lessonId ? { ...l, completed: newCompletedStatus } : l
      ),
    };
    setCourse(updatedCourse);

    try {
      // Update in database
      const { error } = await supabase.from("user_course_progress").upsert(
        {
          user_id: session.user.id,
          course_id: course.id,
          lesson_id: lessonId,
          completed: newCompletedStatus,
          completed_at: newCompletedStatus ? new Date().toISOString() : null,
        },
        {
          onConflict: "user_id,course_id,lesson_id",
        }
      );

      if (error) throw error;

      toast.success(
        newCompletedStatus ? "Lesson completed! 🎉" : "Lesson marked as incomplete"
      );
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error("Failed to update lesson");
      // Revert optimistic update
      setCourse(course);
    }
  };

  const markCourseComplete = async () => {
    if (!course || !session) return;

    try {
      // Mark all lessons as complete
      const updates = course.lessons.map((lesson) => ({
        user_id: session.user.id,
        course_id: course.id,
        lesson_id: lesson.id,
        completed: true,
        completed_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("user_course_progress").upsert(updates, {
        onConflict: "user_id,course_id,lesson_id",
      });

      if (error) throw error;

      // Update local state
      const updatedCourse = {
        ...course,
        lessons: course.lessons.map((lesson) => ({ ...lesson, completed: true })),
      };
      setCourse(updatedCourse);

      toast.success("Congratulations! Course completed! 🎊");
    } catch (error) {
      console.error("Error completing course:", error);
      toast.error("Failed to mark course as complete");
    }
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Course not found</h2>
          <Link to="/">
            <Button variant="default">Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const completedLessons = course.lessons.filter((lesson) => lesson.completed).length;
  const totalLessons = course.lessons.length;
  const progressPercentage = (completedLessons / totalLessons) * 100;
  const isCompleted = completedLessons === totalLessons;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full lg:w-80 h-48 object-cover rounded-lg shadow-md"
            />

            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
                {course.title}
              </h1>
              <p className="text-muted-foreground mb-4 text-lg">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.totalDuration}</span>
                </div>
                <div>
                  <span className="font-medium">Instructor:</span> {course.instructor}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Course Progress
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {completedLessons}/{totalLessons} completed
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Course Content</h2>
            {!isCompleted && (
              <Button onClick={markCourseComplete} size="lg">
                Mark Course Complete
              </Button>
            )}
            {isCompleted && (
              <div className="flex items-center gap-2 text-success font-medium">
                <CheckCircle2 className="h-5 w-5" />
                <span>Completed!</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {course.lessons.map((lesson, index) => (
              <Card
                key={lesson.id}
                className="p-5 hover:shadow-md transition-all duration-300 cursor-pointer border-border"
                onClick={() => toggleLesson(lesson.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {lesson.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">
                          Lesson {index + 1}
                        </p>
                        <h3
                          className={`font-medium text-lg ${lesson.completed
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                            }`}
                        >
                          {lesson.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{lesson.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <div className="flex justify-center py-6">
        <a href="https://github.com/Abigail-Addo/PLP-E-Learning-Platform.git" className="underline text-primary" target="_blank">View code on github</a>
      </div>

    </div>
  );
}
