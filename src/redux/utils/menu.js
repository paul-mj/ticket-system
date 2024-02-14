import React from "react";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

export const menu = [
  {
    icon: <HomeOutlinedIcon />,
    title: "Home",
    iconSize: { width: 50, height: 50 },
    items: []
  },
  {
    icon: <DashboardOutlinedIcon />,
    title: "Dashboard",
    items: [
      {
        title: "Technical Analysis",
        items: [
          {
            title: "The Dow Theory",
            to: "/thedowtheory"
          },
          {
            title: "Charts & Chart Patterns",
            to: "/chart"
          }
        ]
      },
      {
        title: "Fundamental Analysis",
        items: [
          {
            title: "The Dow Theory",
            to: "/thedowtheory"
          },
          {
            title: "Charts & Chart Patterns",
            to: "/chart"
          }
        ]
      }
    ]
  },
  {
    icon: <EmailOutlinedIcon />,
    title: "Mail Setup"
  },
  {
    icon: <CalendarTodayOutlinedIcon />,
    title: "Leave Submission"
  },
  {
    icon: <HomeOutlinedIcon />,
    title: "Home",
    iconSize: { width: 50, height: 50 },
    items: []
  },
  {
    icon: <DashboardOutlinedIcon />,
    title: "Dashboard",
    items: [
      {
        title: "Technical Analysis",
        items: [
          {
            title: "The Dow Theory",
            to: "/thedowtheory"
          },
          {
            title: "Charts & Chart Patterns",
            to: "/chart"
          }
        ]
      },
      {
        title: "Fundamental Analysis",
        items: [
          {
            title: "The Dow Theory",
            to: "/thedowtheory"
          },
          {
            title: "Charts & Chart Patterns",
            to: "/chart"
          }
        ]
      }
    ]
  },
  {
    icon: <EmailOutlinedIcon />,
    title: "Mail Setup"
  },
  {
    icon: <CalendarTodayOutlinedIcon />,
    title: "Leave Submission"
  },
];
