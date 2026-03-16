class AppError(Exception):
    def __init__(self, status_code: int, code: str, message: str, field: str | None = None):
        self.status_code = status_code
        self.code = code
        self.message = message
        self.field = field
        super().__init__(message)


# 1) id не существует
class IdNotFound(AppError):
    def __init__(self):
        super().__init__(
            status_code=404,
            code="id_not_found",
            message="ID does not exist",
            field="id",
        )


# 2) при POST id не равен -1 
# (устаревшее, так как теперь id не передается при создании)
class InvalidPostId(AppError):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="invalid_post_id",
            message="For POST operation, id must be -1",
            field="id",
        )


# 3) дату нельзя ставить на прошлое
class DateInPast(AppError):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="date_in_past",
            message="Date cannot be in the past",
            field=None,
        )


# 4) дату нельзя ставить на будущее
class DateInFuture(AppError):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="date_in_future",
            message="Date cannot be in the future",
            field=None,
        )


# 5) дата не в поясе +0
class InvalidTimezone(AppError):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="invalid_timezone",
            message="Date must be in UTC (+00:00)",
            field=None,
        )


# 6) goal_id не существует
class GoalNotFound(AppError):
    def __init__(self):
        super().__init__(
            status_code=404,
            code="goal_not_found",
            message="Goal ID does not exist",
            field="goal_id",
        )


# 7) user_id не существует 
# (устаревшее, так как теперь user_id не передается при создании, а берется из токена)
class UserNotFound(AppError):
    def __init__(self):
        super().__init__(
            status_code=404,
            code="user_not_found",
            message="User ID does not exist",
            field="user_id",
        )

# 8) нарушение внешнего ключа
class ForeignKeyViolation(AppError):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="foreign_key_violation",
            message="Referenced object does not exist",
            field=None,
        )


# 9) нарушение уникальности
class UniqueViolation(AppError):
    def __init__(self):
        super().__init__(
            status_code=409,
            code="unique_violation",
            message="Object with these parameters already exists",
            field=None,
        )


# 10) обязательное поле не передано
class NotNullViolation(AppError):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="not_null_violation",
            message="Required field is missing",
            field=None,
        )


# 11) нарушение CHECK ограничения
class CheckViolation(AppError):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="check_violation",
            message="Value does not satisfy database constraint",
            field=None,
        )


# 12) общая ошибка целостности данных
class DataIntegrityError(AppError):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="data_integrity_error",
            message="Database integrity constraint violated",
            field=None,
        )


# 13) общая ошибка базы данных
class DatabaseError(AppError):
    def __init__(self):
        super().__init__(
            status_code=500,
            code="database_error",
            message="Unexpected database error occurred",
            field=None,
        )

# 14) пользователь с таким именем уже существует
class UserAlreadyExists(AppError):
    def __init__(self):
        super().__init__(
            status_code=409,
            code="user_already_exists",
            message="User with this username already exists",
            field="username",
        )

# 15) неверный пароль
class InvalidPassword(AppError):
    def __init__(self):
        super().__init__(
            status_code=401,
            code="invalid_password",
            message="Incorrect password",
            field="password",
        )

# 16) неверный токен
class InvalidToken(AppError):
    def __init__(self):
        super().__init__(
            status_code=401,
            code="invalid_token",
            message="Invalid or expired token",
            field="token",
        )

# 17) недостаточно прав для доступа к ресурсу
class PermissionDenied(AppError):
    def __init__(self):
        super().__init__(
            status_code=403,
            code="permission_denied",
            message="You do not have permission to access this resource",
            field=None,
        )

# 18) deadline не может быть раньше date_set
class DeadlineBeforeDateSet(AppError):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="deadline_before_date_set",
            message="Deadline cannot be before date set",
            field="deadline",
        )

# 19) action date не может быть раньше date_set
class ActionBeforeGoal(AppError):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="action_before_goal",
            message="Action date cannot be before goal date set",
            field="date",
        )

# 20) action date не может быть позже deadline
class ActionAfterDeadline(AppError):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="action_after_deadline",
            message="Action date cannot be after goal deadline",
            field="date",
        )

# 21) username не найден при попытке входа
class UsernameNotFound(AppError):
    def __init__(self):
        super().__init__(
            status_code=404,
            code="username_not_found",
            message="Username does not exist",
            field="username",
        )

# 22) некорректный интервал дат (например, start >= finish)
class InvalidInterval(AppError):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="invalid_interval",
            message="Invalid date interval: start must be before finish",
            field=None,
        )

# 23) ежедневная цель не может быть без дедлайна
class EverydayGoalWithoutDeadline(AppError):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="everyday_goal_without_deadline",
            message="Everyday goal must have a deadline",
            field="deadline",
        )