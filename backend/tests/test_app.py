from datetime import datetime, timedelta, timezone

import pytest

from app.core.secure import get_current_user
from app.main import db_check
from app.routers.actions import (
    get_action,
    get_actions,
    post_action,
)
from app.routers.auth import login, register
from app.routers.goals import (
    get_goal,
    get_goals,
    post_goal,
)
from app.schemes import ActionCreate, CreateUser, GoalCreate
from app.services import errors
from fastapi.security import OAuth2PasswordRequestForm


def create_user_and_get_id(db_session, username="tester", password="strongpass123"):
    token = register(CreateUser(username=username, password=password), db_session)
    user_id = get_current_user(token.access_token, db_session)
    return user_id, token


def test_db_check_returns_select_1(db_session):
    assert db_check(db_session) == {"select_1": 1}


def test_register_and_login_return_access_tokens(db_session):
    register_token = register(
        CreateUser(username="tester", password="strongpass123"),
        db_session,
    )

    assert register_token.access_token
    assert register_token.token_type == "bearer"

    login_token = login(
        OAuth2PasswordRequestForm(
            username="tester",
            password="strongpass123",
            scope="",
        ),
        db_session,
    )

    assert login_token.access_token
    assert login_token.token_type == "bearer"
    assert get_current_user(login_token.access_token, db_session) > 0


def test_get_goals_returns_empty_list_for_new_user(db_session):
    user_id, _token = create_user_and_get_id(db_session)

    result = get_goals(None, None, db_session, user_id)

    assert result == []


def test_create_goal_and_fetch_it(db_session):
    user_id, _token = create_user_and_get_id(db_session)
    date_set = datetime.now(timezone.utc)
    deadline = date_set + timedelta(days=4)

    created_goal = post_goal(
        GoalCreate(
            name="Learn pytest",
            description="Write backend API tests",
            color="#12AB34",
            date_set=date_set,
            deadline=deadline,
            everyday=False,
            target_count=3,
        ),
        db_session,
        user_id,
    )

    assert created_goal.id > 0
    assert created_goal.name == "Learn pytest"
    assert created_goal.deadline == deadline.replace(tzinfo=None)
    assert created_goal.target_count == 3
    assert created_goal.current_count == 0
    assert created_goal.streak == 0
    assert created_goal.is_failed is None

    fetched_goal = get_goal(created_goal.id, db_session, user_id)

    assert fetched_goal == created_goal


def test_create_everyday_goal_requires_deadline(db_session):
    user_id, _token = create_user_and_get_id(db_session)

    with pytest.raises(errors.EverydayGoalWithoutDeadline) as exc_info:
        post_goal(
            GoalCreate(
                name="Daily reading",
                description="Read every day",
                color="#AA11CC",
                date_set=datetime.now(timezone.utc),
                deadline=None,
                everyday=True,
                target_count=None,
            ),
            db_session,
            user_id,
        )

    assert exc_info.value.code == "everyday_goal_without_deadline"


def test_get_missing_goal_returns_not_found_error(db_session):
    user_id, _token = create_user_and_get_id(db_session)

    with pytest.raises(errors.IdNotFound) as exc_info:
        get_goal(999, db_session, user_id)

    assert exc_info.value.code == "id_not_found"


def test_duplicate_goal_name_for_same_user_returns_conflict(db_session):
    user_id, _token = create_user_and_get_id(db_session)
    payload = GoalCreate(
        name="Repeatable goal",
        description="First copy",
        color="#334455",
        date_set=datetime.now(timezone.utc),
        deadline=datetime.now(timezone.utc) + timedelta(days=2),
        everyday=False,
        target_count=1,
    )

    first_goal = post_goal(payload, db_session, user_id)

    with pytest.raises(errors.UniqueViolation) as exc_info:
        post_goal(payload, db_session, user_id)

    assert first_goal.id > 0
    assert exc_info.value.code == "unique_violation"


def test_create_action_and_filter_actions_by_range(db_session):
    user_id, _token = create_user_and_get_id(db_session)
    goal_date = datetime.now(timezone.utc) - timedelta(days=2)
    goal = post_goal(
        GoalCreate(
            name="Workout goal",
            description="Track workouts",
            color="#0088FF",
            date_set=goal_date,
            deadline=goal_date + timedelta(days=10),
            everyday=False,
            target_count=4,
        ),
        db_session,
        user_id,
    )
    action_time = datetime.now(timezone.utc) - timedelta(hours=2)

    created_action = post_action(
        ActionCreate(
            name="Morning run",
            description="5 kilometers",
            date=action_time,
            goal_id=goal.id,
        ),
        db_session,
        user_id,
    )

    assert created_action.id > 0
    assert created_action.goal_id == goal.id

    filtered_actions = get_actions(
        goal.id,
        action_time - timedelta(minutes=1),
        action_time + timedelta(minutes=1),
        db_session,
        user_id,
    )

    assert filtered_actions == [created_action]
    assert get_action(created_action.id, db_session, user_id) == created_action


def test_create_action_in_future_returns_app_error(db_session):
    user_id, _token = create_user_and_get_id(db_session)
    goal_date = datetime.now(timezone.utc) - timedelta(days=1)
    goal = post_goal(
        GoalCreate(
            name="Read more",
            description="Track reading",
            color="#FF8800",
            date_set=goal_date,
            deadline=goal_date + timedelta(days=5),
            everyday=False,
            target_count=2,
        ),
        db_session,
        user_id,
    )

    with pytest.raises(errors.DateInFuture) as exc_info:
        post_action(
            ActionCreate(
                name="Tomorrow reading",
                description="Should fail",
                date=datetime.now(timezone.utc) + timedelta(hours=1),
                goal_id=goal.id,
            ),
            db_session,
            user_id,
        )

    assert exc_info.value.code == "date_in_future"


def test_create_action_with_unknown_goal_returns_not_found_error(db_session):
    user_id, _token = create_user_and_get_id(db_session)

    with pytest.raises(errors.GoalNotFound) as exc_info:
        post_action(
            ActionCreate(
                name="Broken action",
                description="Goal does not exist",
                date=datetime.now(timezone.utc) - timedelta(hours=3),
                goal_id=999,
            ),
            db_session,
            user_id,
        )

    assert exc_info.value.code == "goal_not_found"


def test_other_user_cannot_read_foreign_goal(db_session):
    owner_id, _ = create_user_and_get_id(db_session, username="owner")
    stranger_id, _ = create_user_and_get_id(db_session, username="stranger")
    goal = post_goal(
        GoalCreate(
            name="Private goal",
            description="Only owner can see this",
            color="#123456",
            date_set=datetime.now(timezone.utc),
            deadline=datetime.now(timezone.utc) + timedelta(days=2),
            everyday=False,
            target_count=1,
        ),
        db_session,
        owner_id,
    )

    with pytest.raises(errors.PermissionDenied) as exc_info:
        get_goal(goal.id, db_session, stranger_id)

    assert exc_info.value.code == "permission_denied"
