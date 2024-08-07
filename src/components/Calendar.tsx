import React, { useState, useRef } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import { Book } from "../types/Book";

interface CalendarProps {
  books: Book[];
}

export const StyledCalendarWrapper = styled.div`
  .react-calendar {
    width: 100%;
    max-width: 60rem;
    margin: 0 auto;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding-left: 5px;
    padding-right: 5px;
  }

  .react-calendar__navigation {
    min-height: 50px;
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .react-calendar__navigation__prev-button,
  .react-calendar__navigation__prev2-button,
  .react-calendar__navigation__next-button,
  .react-calendar__navigation__next2-button {
    font-size: 25px;
    padding: 15px;
  }

  .react-calendar__month-view__days__day {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 150px;
  }

  .react-calendar__month-view__days__day abbr {
    font-size: 9px;
  }

  .react-calendar__month-view__weekdays {
    display: flex;
    justify-content: center;
  }

  .react-calendar__month-view__weekdays abbr {
    font-weight: 500;
    text-decoration: none;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .react-calendar__month-view__days__day--weekend {
    abbr {
      color: #f87171;
    }
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    abbr {
      color: #d2d4d6;
    }
    pointer-events: none;
  }

  .react-calendar__tile--now {
    abbr {
      font-weight: 800;
      background-color: #5f98f6;
      color: white;
      border-radius: 50%;
      padding: 5px;
      display: inline-block;
    }
  }

  .react-calendar__tile {
    height: 8rem;
    width: 8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1px;
    position: relative;
  }

  .react-calendar__tile--active {
    background-color: #3b82f6;
    color: white;
  }

  .react-calendar__navigation__label {
    font-weight: 500;
    font-size: 18px;
  }

  @media (max-width: 768px) {
    .react-calendar {
      padding: 0px;
    }
    .react-calendar__tile {
      height: 6rem;
      width: 6rem;
      padding: 0.1px;
    }
    .react-calendar__month-view__days__day {
      min-height: 120px;
    }
  }

  @media (max-width: 480px) {
    .react-calendar {
      padding: 0px;
    }
    .react-calendar__tile {
      height: 4rem;
      width: 4rem;
      padding: 0px;
    }
    .react-calendar__month-view__days__day {
      min-height: 90px;
    }
  }
`;

const BookCoversContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
`;

const BookCover = styled.div`
  transition: transform 0.3s ease, opacity 0.3s ease;
  margin: 2px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: black;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CalendarTile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &.cover ${BookCover}:first-child {
    transform: translateX(0);
    opacity: 1;
  }
`;

const BookCount = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 50%;
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
`;

const BookCalendar: React.FC<CalendarProps> = ({ books }) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [errorImages, setErrorImages] = useState<Record<string, boolean>>({});
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());

  const handlePrevMonth = () => {
    if (activeStartDate) {
      const prevMonth = new Date(activeStartDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setActiveStartDate(prevMonth);
    }
  };

  const handleNextMonth = () => {
    if (activeStartDate) {
      const nextMonth = new Date(activeStartDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setActiveStartDate(nextMonth);
    }
  };

  const goToView = () => {
    if (!hoveredDate) {
      console.error("No date hovered");
      return;
    }

    const date = new Date(hoveredDate);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", hoveredDate);
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const url = `/${year}/${month}`;
    window.location.href = url;
  };

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
    id: string
  ) => {
    const target = event.currentTarget as HTMLImageElement;
    setErrorImages((prevErrorImages) => ({
      ...prevErrorImages,
      [id]: true,
    }));
    if (target.src !== "/default.png") {
      target.src = "/default.png";
    }
  };

  const handleAllListClick = () => {
    window.location.href = "/all";
  };

  // Swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    const deltaX = touchEndX.current - touchStartX.current;

    if (Math.abs(deltaX) > 70) {
      if (deltaX > 0) {
        handlePrevMonth();
        // alert("Swiped right!");
      } else {
        handleNextMonth();
        // alert("Swiped left!");
      }
    }
  };

  const getTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const booksForDate = books.filter(
        (book) => new Date(book.Date).toDateString() === date.toDateString()
      );

      if (booksForDate.length > 0) {
        return (
          <CalendarTile
            onMouseEnter={() => setHoveredDate(date.toDateString())}
            onMouseLeave={() => setHoveredDate(null)}
          >
            <BookCoversContainer onClick={goToView}>
              {hoveredDate === date.toDateString() ? (
                booksForDate.map((book, index) => (
                  <BookCover key={index}>
                    <img
                      src={
                        errorImages[book.ID]
                          ? "/default.png"
                          : `/data/covers/${book.ID}.jpg`
                      }
                      alt={book.Title}
                      onError={(event) => handleImageError(event, book.ID)}
                    />
                  </BookCover>
                ))
              ) : (
                <>
                  <BookCover>
                    <img
                      src={
                        errorImages[booksForDate[0].ID]
                          ? "/default.png"
                          : `/data/covers/${booksForDate[0].ID}.jpg`
                      }
                      alt={booksForDate[0].Title}
                      onError={(event) =>
                        handleImageError(event, booksForDate[0].ID)
                      }
                    />
                  </BookCover>
                  {booksForDate.length > 1 && (
                    <BookCount>+{booksForDate.length - 1}</BookCount>
                  )}
                </>
              )}
            </BookCoversContainer>
          </CalendarTile>
        );
      } else {
        return <CalendarTile></CalendarTile>;
      }
    }
    return null;
  };

  return (
    <StyledCalendarWrapper
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={handleAllListClick}
        className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 mb-4 flex items-center"
      >
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        View All Books
      </button>
      <Calendar
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setActiveStartDate(activeStartDate);
        }}
        tileContent={getTileContent}
        locale="en-US"
      />
    </StyledCalendarWrapper>
  );
};

export default BookCalendar;
