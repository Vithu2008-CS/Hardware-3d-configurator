# 🛠️ 3D High-End Hardware Configurator

An immersive, high-performance single-page web application that allows users to customize premium hardware components interactively in a real-time 3D environment. This project demonstrates advanced frontend system design, pairing consumer-grade interactive 3D graphics with enterprise-grade **Identity and Access Management (IAM)** using the **WSO2 Asgardeo Auth SDK**.

Live Link: [your-project.vercel.app](https://your-project.vercel.app)

---

## 🚀 Key Features

*   **Real-Time 3D Viewport:** Interactive manipulation of materials, roughness, metalness, and lighting vectors on complex hardware geometry.
*   **Enterprise Identity Management:** Single Sign-On (SSO) and OIDC-compliant user flows powered completely by **WSO2 Asgardeo**.
*   **Secure Feature Guarding:** Context-aware UI layouts that seamlessly unlock premium features (such as "Save Configuration" and cloud persistence) upon successful token acquisition.
*   **Reactive Pricing Engine:** High-frequency layout updates reflecting real-time pricing changes synchronized instantly with spatial customization choices.

---

## 🏗️ Architectural System Design

A major challenge in interactive 3D web applications is preventing high-frequency frame renders from blocking or degrading user experience surfaces like authentication context and configuration state. 

This application implements a decoupled architectural model:

```text
       ┌────────────────────────────────────────────────────────┐
       │             WSO2 Asgardeo AuthProvider                 │
       │           (Root App Router Context Wrapper)            │
       └───────────────────────────┬────────────────────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
┌───────────────────────────┐             ┌───────────────────────────┐
│     Zustand Config Store  │             │   Next.js 15 Server DOM   │
│  (Isolated Spatial State) │             │     (Static/SSR Layout)   │
└─────────────┬─────────────┘             └─────────────┬─────────────┘
              │                                         │
              ▼                                         ▼
┌───────────────────────────┐             ┌───────────────────────────┐
│ React Three Fiber Canvas  │             │ Dynamic UI Control Panel  │
│  (Isolated 3D Viewport)   │             │   (Guarded Client Hooks)  │
└───────────────────────────┘             └───────────────────────────┘