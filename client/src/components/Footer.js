import React from 'react'

const Footer = () => {
    return (
        <div className='fotter'>
            <div className='sb__fotter section__padding'>
                <div className='sb__fotter-links'>
                    <div>
                        <div className='sb__fotter-links-div'>
                            <img src="https://www.nasa.gov/wp-content/themes/nasa/assets/images/nasa-logo.svg" alt="Description of the image"  />
                            <p>NASA explores the unknown in air and space, innovates for the benefit of humanity, and inspires the world through discovery.</p>
                        </div>
                    </div>
                    <div className='sb__fotter-links-alt'>
                        <div className='sb__fotter-links_div padding-t1'>
                            {/* <h4>Our Technologies</h4> */}
                            <a href="/resource">
                                <p className='text-link'>Home</p>
                            </a>
                            <a href="/resource">
                                <p className='text-link'>News & Events</p>
                            </a>
                            <a href="/resource">
                                <p className='text-link'>Multimedia</p>
                            </a>
                            <a href="/resource">
                                <p className='text-link'>Missions</p>
                            </a>
                        </div>
                        <div className='sb__fotter-links_div padding-t'>
                            {/* <h4>Our Services</h4> */}
                            <a href="/resource">
                                <p className='text-link'>The Universe</p>
                            </a>
                            <a href="/resource">
                                <p className='text-link'>Aeronautics</p>
                            </a>
                            <a href="/resource">
                                <p className='text-link'>Technology</p>
                            </a>
                            <a href="/resource">
                                <p className='text-link'>About NASA</p>
                            </a>
                        </div>
                    </div>
                </div>

                <hr />
                <div className='sb_fotter-below'>
                    <a href="/terms"><div><p className='text-link'>Terms & Conditions</p></div></a>
                    <a href="/terms"><div><p className='text-link'>Privacy Policy</p></div></a>
                </div>
            </div>
        </div>
    )
}

export default Footer
