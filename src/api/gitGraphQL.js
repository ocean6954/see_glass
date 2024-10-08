import axios from "axios";

const getDateRange = (period) => {
  const toDate = new Date(); // 現在の日付
  let fromDate = new Date();

  if (period === "3months") {
    fromDate.setMonth(toDate.getMonth() - 3); // 3ヶ月前
  } else if (period === "6months") {
    fromDate.setMonth(toDate.getMonth() - 6); // 半年前
  } else if (period === "1year") {
    fromDate.setFullYear(toDate.getFullYear() - 1); // 1年前
  }

  return { from: fromDate.toISOString(), to: toDate.toISOString() };
};

export const fetchData = async (username, period) => {
  console.log("fetchDataの呼び出し");
  const { from, to } = getDateRange(period);

  const query = `
        {
          user(login: "${username}") {
            contributionsCollection(from: "${from}", to: "${to}") {
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
      `;

  try {
    const response = await axios.post(
      "https://api.github.com/graphql",
      { query },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
        },
      }
    );
    const weeks =
      response.data.data.user.contributionsCollection.contributionCalendar
        .weeks;
    return weeks;
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
  }
};
