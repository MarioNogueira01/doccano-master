<<<<<<< HEAD
from django.urls import path
=======
from django.urls import path, include
>>>>>>> tentativa

from .views import TaskStatus

urlpatterns = [
    path(route="tasks/status/<task_id>", view=TaskStatus.as_view(), name="task_status"),
<<<<<<< HEAD
=======
    path("users/", include("users.urls"))
>>>>>>> tentativa
]
