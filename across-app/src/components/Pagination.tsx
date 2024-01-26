import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

class Pagination extends React.Component<PaginationProps> {
    render() {
        const { currentPage, totalPages, onPageChange } = this.props;

        return (
            <nav>
                <ul className="pagination justify-content-center mt-5">        
                    {/* Previous Page Button */}
                    <li className="page-item">
                        <a 
                            className={`page-link ${currentPage === 1 ? 'disabled' : ''}`} 
                            href="#"
                            aria-label="Previous"
                            onClick={(e) => {
                                if (currentPage === 1) {
                                    e.preventDefault();
                                } else {
                                    onPageChange(currentPage - 1);
                                }
                            }}
                        >
                        <span aria-hidden="true">Prev</span>
                        </a>
                    </li>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <li className={`page-item ${page === currentPage ? 'active' : ''}`} key={page} aria-current={page === currentPage ? "page" : undefined}>
                            <a 
                            className="page-link" 
                            href="#"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent default anchor behavior
                                if (page !== currentPage) {
                                    onPageChange(page);
                                }
                            }}
                            >
                            {page}
                            </a>
                        </li>
                    ))}

                    {/* Next Page Button */}
                    <li className="page-item">
                        <a 
                            className={`page-link ${currentPage === totalPages ? 'disabled' : ''}`} 
                            href="#"
                            aria-label="Next"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent default anchor behavior
                                if (currentPage !== totalPages) {
                                    onPageChange(currentPage + 1);
                                }
                            }}
                        >
                            <span aria-hidden="true">Next</span>
                        </a>
                    </li>
                </ul>  
            </nav>
        );
    }
}

export default Pagination;
