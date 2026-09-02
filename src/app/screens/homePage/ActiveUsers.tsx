import { Box, Container } from "@mui/material";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { serverApi } from "../../../lib/config";
import { Member } from "../../../lib/types/member";

/**
 * Active Users — no dedicated Figma node (this section has no HikMali
 * counterpart; the closest real design anchor is the Testimonial section's
 * circular-avatar credit treatment, node 7:122: `size-[58px]` circular
 * photo, Montserrat Medium 14px name, #aeb192 14px secondary line). Reused
 * here at a larger, featured scale appropriate to a single highlighted
 * member rather than a small review credit — same circular shape,
 * Montserrat weights, and palette, not invented proportions.
 *
 * Was the last remaining @mui/joy consumer in the codebase (Card,
 * CardOverflow, AspectRatio, CssVarsProvider, Typography) — dropped in
 * favor of plain className + home.css, matching how Footer dropped
 * styled-components earlier in this rebuild.
 */
const topUsersRetriever = createSelector(retrieveTopUsers, (topUsers) => ({
  topUsers,
}));

export default function ActiveUsers() {
  const { topUsers } = useSelector(topUsersRetriever);
  return (
    <div className={"active-users"}>
      <Container className={"au-inner"}>
        <h2 className={"au-title"}>Active Users</h2>
        <Box className={"au-row"}>
          {topUsers.length !== 0 ? (
            topUsers.map((member: Member) => {
              const imagePath = member.memberImage
                ? `${serverApi}/${member.memberImage}`
                : "/icons/default-user.svg";
              return (
                <Box key={member._id} className={"au-card"}>
                  <Box
                    className={"au-avatar"}
                    style={{ backgroundImage: `url(${imagePath})` }}
                  />
                  <span className={"au-nickname"}>{member.memberNick}</span>
                </Box>
              );
            })
          ) : (
            <Box className="au-no-data">No Active Users!</Box>
          )}
        </Box>
      </Container>
    </div>
  );
}
