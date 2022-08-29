import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';

export default function Footer() {
    return (
        <MDBFooter className='text-center text-lg-left' style={{ backgroundColor: '#838383' }}>
            <MDBContainer className='p-4'>
                <MDBRow>
                    <MDBCol lg='8' md='12' className='mb-4 mb-md-0'>
                        <h5>About the SQAB website </h5>

                        <p>
                            This site is built using Bootstrap Material Design and is hosted on Github Pages. This site, along with all of the assets/code, is available for public inspection at the GitHub account linked below in the repository "SQAB-ABAI.github.io" under a MIT license.
                        </p>
                    </MDBCol>

                    <MDBCol lg='4' md='12' className='mb-4 mb-md-0'>
                        <h5>Links</h5>

                        <ul>
                            <li><a href='https://getbootstrap.com/docs/4.0/getting-started/introduction/'>Twitter bootstrap</a></li>
                            <li><a href='https://mdbootstrap.com/docs/standard/'>Bootstrap Material Design</a></li>
                            <li><a href='https://github.com/miyamot0'>Github Repositories</a></li>
                        </ul>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

            <div className='text-center p-3' style={{ backgroundColor: '#515151' }}>
                &copy; Designed by Shawn P. Gilroy{' '}
                <a className='text-dark' href='https://www.smallnstats.com/'>
                    www.smallnstats.com
                </a>
            </div>
        </MDBFooter>
    );
}