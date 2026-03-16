from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint, text, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Action(Base):
    __tablename__ = "actions"

    id: Mapped[int] = mapped_column(primary_key=True)
    goal_id: Mapped[int] = mapped_column(
        ForeignKey("goals.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name       : Mapped[str]        = mapped_column(String(255), nullable=False)
    date       : Mapped[datetime]   = mapped_column(DateTime(timezone=True), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # status: Mapped[str] = mapped_column(
    #     String(50),
    #     nullable=False,
    #     server_default=text("'pending'"),
    # )

    # created_at: Mapped[datetime] = mapped_column(
    #     DateTime(timezone=True),
    #     server_default=text("now()"),
    #     nullable=False,
    # )

    goal: Mapped["Goal"] = relationship(back_populates="actions")