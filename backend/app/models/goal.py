from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint, text, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Goal(Base):
    __tablename__ = "goals"
    __table_args__ = (
        UniqueConstraint("user_id", "name", name="uq_goals_user_name"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name         : Mapped[str]         = mapped_column(String(255), nullable=False)
    date_set     : Mapped[datetime]    = mapped_column(DateTime(timezone=True), nullable=False)
    description  : Mapped[str | None]  = mapped_column(Text, nullable=True)
    color        : Mapped[str]         = mapped_column(String(7), nullable=False)
    deadline     : Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    everyday     : Mapped[bool]        = mapped_column(nullable=False, default=False)
    
    # created_at: Mapped[datetime] = mapped_column(
    #     DateTime(timezone=True),
    #     server_default=text("now()"),
    #     nullable=False,
    # )

    user: Mapped["User"] = relationship(back_populates="goals")

    actions: Mapped[list["Action"]] = relationship(
        back_populates="goal",
        cascade="all, delete-orphan",
    )