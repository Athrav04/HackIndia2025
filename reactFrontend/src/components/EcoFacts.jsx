import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./EcoFacts.css";

// List of eco-friendly facts to display
const ecoFacts = [
  "Bamboo grows up to 35 inches per day, making it a sustainable material",
  "A single reusable water bottle can replace 1,460 plastic bottles per year",
  "Using reusable bags can eliminate 300-700 plastic bags annually",
  "LED bulbs use 75% less energy than traditional bulbs",
  "Recycling one aluminum can saves enough energy to run a TV for 3 hours",
  "Plant-based cleaning products reduce water pollution by 30%",
  "Composting can reduce household waste by up to 30%",
  "Solar energy production generates 96% less carbon emissions than coal",
];

export default function EcoFacts() {
  const [visibleFacts, setVisibleFacts] = useState([]);
  const factsContainerRef = useRef(null);
  const timer = useRef(null);

  // Function to add a new fact
  const addFact = () => {
    // Get a random fact not currently displayed
    const availableFacts = ecoFacts.filter(
      (fact) => !visibleFacts.some((vf) => vf.text === fact)
    );

    if (availableFacts.length === 0) return;

    const randomFact =
      availableFacts[Math.floor(Math.random() * availableFacts.length)];

    // Determine random position
    const side = Math.random() > 0.5 ? "left" : "right";
    const position = {
      x: side === "left" ? "0%" : "80%",
      y: 10 + Math.random() * 70 + "%", // Random vertical position
    };

    const newFact = {
      id: Date.now(),
      text: randomFact,
      position,
      side,
    };

    setVisibleFacts((prev) => [...prev, newFact]);

    // Remove fact after it's animated
    setTimeout(() => {
      setVisibleFacts((prev) => prev.filter((fact) => fact.id !== newFact.id));
    }, 15000); // Fact stays visible for 15 seconds
  };

  useEffect(() => {
    // Start adding facts periodically
    timer.current = setInterval(() => {
      if (visibleFacts.length < 3) {
        // Limit to 3 facts at a time
        addFact();
      }
    }, 6000); // Add a new fact every 6 seconds

    // Add first fact immediately
    addFact();

    return () => {
      clearInterval(timer.current);
    };
  }, [visibleFacts]);

  useEffect(() => {
    // Animate each fact when it appears
    visibleFacts.forEach((fact) => {
      const factElement = document.getElementById(`fact-${fact.id}`);
      if (factElement) {
        gsap.fromTo(
          factElement,
          {
            opacity: 0,
            x: fact.side === "left" ? -50 : 50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
          }
        );

        // Animate the fact across the screen
        gsap.to(factElement, {
          x: fact.side === "left" ? "100vw" : "-100vw",
          duration: 30,
          ease: "linear",
          delay: 1,
        });
      }
    });
  }, [visibleFacts]);

  return (
    <div className="eco-facts-container" ref={factsContainerRef}>
      {visibleFacts.map((fact) => (
        <div
          key={fact.id}
          id={`fact-${fact.id}`}
          className="eco-fact"
          style={{
            top: fact.position.y,
            left: fact.position.x,
          }}
        >
          <div className="eco-fact-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm1 14h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <p>{fact.text}</p>
        </div>
      ))}
    </div>
  );
}
