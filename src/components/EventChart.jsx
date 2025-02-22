import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const taskChart = ({ tasks }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    const durations = tasks.map((task) => {
      const start = new Date(task.start);
      const end = new Date(task.end);
      return (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
    });

    // Separate tasks into done and not done categories
    const donetasks = tasks.filter((task) => task.done);
    const notDonetasks = tasks.filter((task) => !task.done);

    // Create datasets for done and not done tasks
    const doneDurations = donetasks.map((task) => {
      const start = new Date(task.start);
      const end = new Date(task.end);
      return (end - start) / (1000 * 60 * 60);
    });

    const notDoneDurations = notDonetasks.map((task) => {
      const start = new Date(task.start);
      const end = new Date(task.end);
      return (end - start) / (1000 * 60 * 60);
    });

    // Set background colors for done and not done tasks
    const doneBackgroundColor = donetasks.map(() => "rgba(255, 99, 132, 0.6)"); // Red for done
    const notDoneBackgroundColor = notDonetasks.map(
      () => "rgba(75, 192, 192, 0.6)"
    ); // Green for not done

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: new Array(tasks.length).fill(""), // Empty strings to hide labels
        datasets: [
          {
            label: "Done tasks",
            data: doneDurations,
            backgroundColor: doneBackgroundColor,
            borderColor: "rgba(255, 99, 112, 1)",
            borderWidth: 1,
            tooltipLabel: donetasks.map((task) => task.title), // Custom data for tooltips
          },
          {
            label: "Not Done tasks",
            data: notDoneDurations,
            backgroundColor: notDoneBackgroundColor,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            tooltipLabel: notDonetasks.map((task) => task.title), // Custom data for tooltips
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: false, // Hides the x-axis labels
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Duration (Hours)",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                // Display custom title (task name) in the tooltip
                const datasetIndex = tooltipItems[0].datasetIndex;
                const dataset =
                  chartInstance.current.data.datasets[datasetIndex];
                return dataset.tooltipLabel[tooltipItems[0].dataIndex];
              },
            },
          },
        },
      },
    });
  }, [tasks]);

  return <canvas height={"100px"} ref={chartRef} />;
};

export default taskChart;
