# SchedMaster

**SchedMaster** is an AI-assisted course scheduling web application created for UC Santa Cruz students who want to build better class schedules with less stress. By combining professor ratings with course and time preferences, SchedMaster helps students make more confident academic decisions during quarterly enrollment.

Designed around the UCSC student experience, SchedMaster transforms informal professor feedback into clear and actionable schedule recommendations.

---

## What SchedMaster Does

SchedMaster guides students through a simple, step-by-step workflow to generate an optimized class schedule. Users begin by rating professors on a five-point scale based on personal experience or preference. They then select the courses they plan to take for the upcoming quarter. Using this input, the application generates a recommended schedule that prioritizes higher-rated professors, avoids time conflicts, and explains why each class was selected.

This approach reduces guesswork during enrollment and helps students feel more confident about their final schedule.

---

## Features

SchedMaster follows a guided three-step flow that mirrors how UCSC students typically plan their schedules. The application uses AI-assisted logic to rank and filter course options based on professor ratings and schedule compatibility. The interface is colorful yet professional and fully responsive, making it easy to use.

---

## Tech Stack

SchedMaster is built with a modern JavaScript frontend using **React** and **Vite** for fast development and performance. Styling is handled with **Tailwind CSS** to maintain a clean and consistent design. The backend is powered by **Node.js**, which handles scheduling logic, data processing, and communication with the AI layer. Antigravity is used to assist with ranking schedules and generating explanations based on user input. The project runs locally and does not rely on third-party hosting platforms.

---

## How the AI Works

SchedMaster uses Antigravity to assist with analyzing professor ratings and course preferences provided by the user. The system ranks course-professor combinations, filters out scheduling conflicts, and selects the most optimal schedule based on quality and compatibility. To maintain transparency, the application provides brief explanations describing why each class was recommended.

All course and professor data is mock data, and no real UCSC enrollment systems are accessed.

---

## Running Locally

To run SchedMaster locally, clone the repository from GitHub and install the required dependencies. After installation, start the development server and open the application in your browser at ` (http://169.233.121.48:5173/)`. This allows you to explore and modify the project in a local development environment.

---

## Future Improvements

Future versions of SchedMaster could include persistent storage for professor ratings, user accounts to save schedules across quarters, and additional scheduling preferences such as avoiding early morning classes or creating more compact schedules. Integration with real UCSC course data and a mobile-first version could be potential expansions.

---

## Inspiration

UCSC students often rely on spreadsheets, Reddit threads, or word of mouth when choosing professors. SchedMaster was created to centralize that decision-making process into a single, simple tool that makes scheduling clearer, faster, and less stressful.

---

## Team

SchedMaster was built for Cruzhacks with the UCSC community in mind. Feel free to explore the repository, fork the project, and build upon it.
