import React from 'react';

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBRow,
  MDBCol,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from 'mdb-react-ui-kit';

import './Recruitment.css';
import moment from 'moment';
import { RecruitmentAd } from './types/RecruitmentTypes';
import { useFirebaseCollection } from '../../firebase/useFirebaseCollection';

export default function Recruitment(): JSX.Element {
  const { documents } = useFirebaseCollection('recruitment');

  return (
    <>
      <MDBRow center className="row-eq-height">
        <MDBCol sm="11">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Current and Upcoming Graduate Student Opportunities</MDBCardTitle>

              <MDBTable responsive>
                <MDBTableHead>
                  <tr>
                    <th className="recruitment-table-th" scope="col">
                      Mentor/Contact
                    </th>
                    <th className="recruitment-table-th" scope="col">
                      Mentor Information
                    </th>
                    <th className="recruitment-table-th" scope="col">
                      Description of Lab/Program
                    </th>
                    <th className="recruitment-table-th" scope="col">
                      Cycle
                    </th>
                    <th className="recruitment-table-th" scope="col">
                      Site
                    </th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {(documents as RecruitmentAd[])
                    ? (documents as RecruitmentAd[])
                        .sort((a, b) => {
                          return moment(new Date(a.Cycle), 'DD/MM/YYYY HH:mm:ss').isAfter(
                            moment(new Date(b.Cycle), 'DD/MM/YYYY HH:mm:ss'),
                          )
                            ? 1
                            : -1;
                        })
                        .map((recr) => {
                          return (
                            <tr key={recr.Contact} className="recruitment-table-tr">
                              <td>
                                <a className="fw-normal mb-1" href={`mailto:${recr.Contact}`}>
                                  {recr.Mentor}
                                </a>
                                <p className="text-muted mb-0">{recr.Institution}</p>
                              </td>
                              <td>{recr.Bio}</td>
                              <td>{recr.Description}</td>
                              <td>{recr.Cycle}</td>
                              <td>
                                {recr.Link.trim().length === 0 ? '' : <a href={recr.Link}>Link</a>}
                              </td>
                            </tr>
                          );
                        })
                    : null}
                </MDBTableBody>
              </MDBTable>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </>
  );
}
