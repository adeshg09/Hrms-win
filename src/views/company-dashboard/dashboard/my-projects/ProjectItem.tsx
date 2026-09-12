/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description My Projects Page to handle the projects.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 28/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
// import { useEffect, useState, useContext } from 'react';
import {
  // Accordion,
  // AccordionDetails,
  // AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography
} from '@mui/material';
// import {
//   ExpandMore as ExpandMoreIcon,
//   InfoOutlined as InfoOutlinedIcon
// } from '@mui/icons-material';
// import moment from 'moment';
import DOMPurify from 'dompurify';

/* Relative Imports */
// import { AdminDashboardPage } from 'components/Page';
// import useSnackbarClose from 'hooks/useSnackbarClose';
// import SessionContext from 'context/SessionContext';
// import Loader from 'components/Loader';
// import { getProjectsRequest } from 'services/company/user/project';
// import { ProjectModel } from 'models/company';

/* Local Imports */
import styles from './project.style';

// ----------------------------------------------------------------------

/**
 * Component to create the tracker listing with add/edit/delete actions.
 *
 * @component
 * @returns {JSX.Element}
 */
const ProjectItem = ({
  projectDetail,
  onOpenDetailPopover
}: any): JSX.Element => {
  /* Functions */
  /**
   * function to get the project grid item
   *
   * @param {any} title - title of item
   * @param {any} value - value of item
   * @returns {void}
   */
  const getProjectGridItem = ({ title, value }: any): JSX.Element => (
    <Grid item container alignItems="center" mb={1}>
      <Grid item xs={6}>
        <Typography variant="h6" color="textPrimary">
          {title}:
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Box component="span" sx={styles.taskdetail}>
          {value}
        </Box>
      </Grid>
    </Grid>
  );

  // (
  //   myProject.map(
  //     (item: ProjectModel, key: any): JSX.Element => (
  //       <Accordion square key={item.id} sx={styles.accordion}>
  //         <AccordionSummary
  //           expandIcon={<ExpandMoreIcon />}
  //           aria-controls={`panel${key + 1}d-content`}
  //           id={`panel${key + 1}d-header`}
  //           sx={styles.accordionSummary}
  //         >
  //           <Typography variant="h5">
  //             {`#${key + 1} - `} {item.name}
  //           </Typography>
  //         </AccordionSummary>
  //         <AccordionDetails sx={styles.accordionDetails}>
  //           <Grid container spacing={2} direction="column">
  //             <Grid item>
  //               <Typography
  //                 dangerouslySetInnerHTML={{
  //                   __html: DOMPurify.sanitize(item.description)
  //                 }}
  //                 sx={styles.taskdesc}
  //               />
  //             </Grid>
  //             <Grid item container alignItems="center">
  //               <Grid item xs={6}>
  //                 <Typography variant="h6" color="textPrimary">
  //                   Project Manager:
  //                 </Typography>
  //               </Grid>
  //               <Grid item xs={6}>
  //                 <Box component="span" sx={styles.taskdetail}>
  //                   {`${item.project_manager.first_name} ${item.project_manager.last_name}`}
  //                 </Box>
  //               </Grid>
  //             </Grid>
  //             <Grid item container alignItems="center">
  //               <Grid item xs={6}>
  //                 <Typography variant="h6" color="textPrimary">
  //                   Team Leader:
  //                 </Typography>
  //               </Grid>
  //               <Grid item xs={6}>
  //                 <Box component="span" sx={styles.taskdetail}>
  //                   {`${item.team_leader.first_name} ${item.team_leader.last_name}`}
  //                 </Box>
  //               </Grid>
  //             </Grid>
  //             <Grid item container alignItems="center">
  //               <Grid item xs={6}>
  //                 <Typography variant="h6" color="textPrimary">
  //                   Team Members:
  //                 </Typography>
  //               </Grid>
  //               <Grid item xs={6}>
  //                 <Typography component="span" sx={styles.taskdetail}>
  //                   {item.team_members.map((teamItem) => (
  //                     <Box
  //                       component="span"
  //                       sx={styles.taskdetail}
  //                       key={teamItem.id}
  //                     >
  //                       {`${teamItem.first_name} ${teamItem.last_name}`}
  //                     </Box>
  //                   ))}
  //                 </Typography>
  //               </Grid>
  //             </Grid>
  //             <Grid item container alignItems="center">
  //               <Grid item xs={6}>
  //                 <Typography variant="h6" color="textPrimary">
  //                   Client:
  //                 </Typography>
  //               </Grid>
  //               <Grid item xs={6}>
  //                 <Box component="span" sx={styles.taskdetail}>
  //                   {`${item.tr_client?.name || ''}`}
  //                 </Box>
  //               </Grid>
  //             </Grid>
  //             <Grid item container alignItems="center">
  //               <Grid item xs={6}>
  //                 <Typography variant="h6" color="textPrimary">
  //                   Estimated Time:
  //                 </Typography>
  //               </Grid>
  //               <Grid item xs={6}>
  //                 <Box component="span" sx={styles.taskdetail}>
  //                   {`${item.estimate_time} hrs`}
  //                 </Box>
  //               </Grid>
  //             </Grid>
  //             <Grid item container alignItems="center">
  //               <Grid item xs={6}>
  //                 <Typography variant="h6" color="textPrimary">
  //                   Created Date:
  //                 </Typography>
  //               </Grid>
  //               <Grid item xs={6}>
  //                 <Box component="span" sx={styles.taskdetail}>
  //                   {moment(item.created_date).format('DD-MM-YYYY')}
  //                 </Box>
  //               </Grid>
  //             </Grid>
  //           </Grid>
  //         </AccordionDetails>
  //       </Accordion>
  //     )
  //   )
  // )

  /* Output */
  return (
    <Grid item md={4} sm={6} xs={12}>
      <Card variant="outlined" sx={styles.projectItemCardStyle}>
        <CardHeader
          title={projectDetail.name}
          sx={styles.projectItemHeaderStyle}
          titleTypographyProps={{ variant: 'h6', component: 'h6' }}
        />
        <CardContent>
          <Typography
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(projectDetail.description)
            }}
            sx={{
              // fontSize: '0.875rem',
              // paddingBottom: 10,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical'
              // '& > p': {
              //     overflow: 'hidden',
              //     textOverflow: 'ellipsis',
              //     display: '-webkit-box',
              //     WebkitLineClamp: '2',
              //     WebkitBoxOrient: 'vertical'
              //   }
            }}
            color="text.secondary"
          />

          {/* <Typography variant="h6" component="h6" color="text.primary">
                Project Manager :
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  paddingLeft: 20,
                  '&:not(:last-child)': {
                    paddingBottom: 10
                  }
                }}
                color="text.secondary"
              >
                {projectDetail.project_manager.first_name
                  ? `${projectDetail.project_manager.first_name} ${projectDetail.project_manager.last_name}`
                  : 'N/A'}
              </Typography> */}
          {getProjectGridItem({
            title: 'Project Manager',
            value: `${projectDetail.project_manager.first_name} ${projectDetail.project_manager.last_name}`
          })}
          {getProjectGridItem({
            title: 'Team Leader',
            value: projectDetail.team_leader.first_name
              ? `${projectDetail.team_leader.first_name} ${projectDetail.team_leader.last_name}`
              : 'N/A'
          })}
          {getProjectGridItem({
            title: 'Client Name',
            value: projectDetail.tr_client?.name || 'N/A'
          })}
          {getProjectGridItem({
            title: 'Start Date',
            value: projectDetail.start_date
          })}

          {/* <Typography variant="h6" component="h6" color="text.primary">
                Team Leader :
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  paddingLeft: 20,
                  '&:not(:last-child)': {
                    paddingBottom: 10
                  }
                }}
                color="text.secondary"
              >
                {projectDetail.team_leader.first_name
                  ? `${projectDetail.team_leader.first_name} ${projectDetail.team_leader.last_name}`
                  : 'N/A'}
              </Typography> */}
          {/* <Typography variant="h6" component="h6" color="text.primary">
                Client Name :
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  paddingLeft: 20,
                  '&:not(:last-child)': {
                    paddingBottom: 10
                  }
                }}
                color="text.secondary"
              >
                {projectDetail.tr_client?.name || 'N/A'}
              </Typography> */}
          {/* <Typography variant="h6" component="h6" color="text.primary">
                Task Duration :
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  paddingLeft: 20,
                  '&:not(:last-child)': {
                    paddingBottom: 10
                  }
                }}
                color="text.secondary"
              >
                {projectDetail.TaskDuration}
                {projectDetail.TaskDuration > 1 ? ' Hours' : ' Hour'}
              </Typography> */}
          {/* <Typography variant="h6" component="h6" color="text.primary">
                Start Date :
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  paddingLeft: 20,
                  '&:not(:last-child)': {
                    paddingBottom: 10
                  }
                }}
                color="text.secondary"
              >
                {projectDetail.start_date}
              </Typography> */}
        </CardContent>
        {/* <Typography sx={styles.nodatatext}>
              <InfoOutlinedIcon sx={styles.nodataIcon} />
              <span>Opps!! No projects are assigned to you.</span>
            </Typography> */}
        <CardActions
          sx={(theme: any) => ({
            borderTop: `1px solid ${theme.palette.divider}`
          })}
        >
          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={(e) => onOpenDetailPopover(e, projectDetail)}
          >
            Read more
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ProjectItem;
