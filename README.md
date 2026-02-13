# React + Vite
 Certificates of Insurance (COI) Review Dashboard
Certificate of Insurance (COI) Review Dashboard application that allows users to:
View certificates of insurance


Create new COIs


Manage property and tenant insurance records


Review and update certificate status
Add new properties


The application is fully deployed on AWS Cloud with CI/CD integration, uses Redux Toolkit for state management, and is fully responsive across all devices.

 Live Deployment
Deployed on AWS Cloud using CI/CD pipeline.
http://certificate-insurance-bucket.s3-website.ap-south-1.amazonaws.com/
Tech Stack
Frontend
React.js (vite)


 React Router


 Redux Toolkit (State Management)


 Tailwind CSS (Responsive UI)






Cloud & DevOps
 AWS (Deployment)


 CI/CD Integration (AWS Pipeline / Buildspec)



Project Structure
certificates-of-insurance/
│
├── src/         # React Frontend
├── 
├── buildspec.yml   # CI/CD configuration
└── README.md


 How to Clone and Run Locally
Clone the Repository
-- git clone https://github.com/syedriyaz6788developer/certificates-of-insurance.git
-- cd dir_name
  Run
--npm run dev


http://localhost:5173/coi-dashboard



This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
