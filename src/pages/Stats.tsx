import { useOutletContext } from "react-router-dom";
import { User } from "../types/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import { PieChart } from "@mui/x-charts/PieChart";

export default function Stats() {
  const { data } = useOutletContext() as { data: User };

  return (
    <>
      <div className="px-4 md:px-0 w-full mx-auto flex justify-center text-gray-100">
        <div className="bg-gray-400 rounded-lg md:mx-4 p-4 w-full max-w-5xl flex flex-col gap-4 md:gap-6 shadow-sm">
          <div className="flex gap-4">
            <FontAwesomeIcon
              icon={faChartBar}
              className="rounded-md pl-1 text-5xl pr-2 text-red-500"
            />
            <div className="w-full flex flex-col justify-start gap-2">
              <h2 className="text-lg logo pb-1">Stats</h2>
              <div className="w-full flex flex-col md:flex-row justify-between md:gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm">
                    Leaderboard Position:{" "}
                    {data.current_user.stats.leaderboard_position}
                  </span>
                  <span className="text-sm">
                    Total Completed Solutions:{" "}
                    {data.current_user.solutions.length}
                  </span>
                  <span className="text-sm">
                    Total Solved Puzzles:{" "}
                    {data.current_user.solved_puzzles.length}
                  </span>
                  <span className="text-sm">
                    Total Authored Puzzles:{" "}
                    {data.current_user.created_puzzles.length}
                  </span>
                </div>
                <div className="pt-1 flex items-start md:pl-24">
                  <FontAwesomeIcon
                    icon={faLaptopCode}
                    className="hidden md:block rounded-md text-lg pr-2 text-red-500"
                  />
                  <div className="w-full flex flex-col gap-1 items-start">
                    <span className="text-sm">
                      Total Languages Used: {data.current_user.languages.length}
                    </span>
                    <span className="text-sm">
                      Most Used:{" "}
                      {data.current_user.stats.most_used_language || "null"}
                    </span>
                  </div>
                </div>
                <div className="w-0 md:w-8"></div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="flex flex-col items-start md:flex-row gap-4">
            <div className="md:w-[54%] flex flex-col justify-between md:justify-start gap-2 md:pl-16">
              <div className="flex flex-col md:flex-row gap-4 h-full md:pl-2">
                <div className="flex items-start w-full h-full">
                  <div className="flex flex-col items-start">
                    <span className="logo text-md pb-2">
                      Language-To-Solution Breakdown:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(
                        data.current_user.solutions_by_language,
                      ).map((language) => {
                        return (
                          <div
                            key={`${language[0]}`}
                            className="badge badge-outline"
                          >{`${language[0]} ${language[1]}`}</div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="w-0 md:w-8"></div>
              </div>
            </div>
            <div className="pl-4">
              <PieChart
                series={[
                  {
                    data: Object.entries(
                      data.current_user.solutions_by_language,
                    ).map(([label, value], index) => ({
                      id: index,
                      value: value,
                      label: label,
                    })) as { id: number; value: number; label: string }[],
                    innerRadius: 70,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                slotProps={{
                  legend: {
                    hidden: true,
                  },
                }}
                width={300}
                height={200}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
