import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

class Pagination extends React.Component<PaginationProps> {
    getPageNumbers() {
        const { currentPage, totalPages } = this.props;
        let pages = [];
    
        // Always include the first page
        pages.push(1);
    
        // Include ellipsis if there are pages skipped before current page
        if (currentPage > 3) {
            pages.push("...");
        }
    
        // Include the page before current page if it's more than the first page
        if (currentPage > 2) {
            pages.push(currentPage - 1);
        }
    
        // Include current page if it's not the first or last page
        if (currentPage !== 1 && currentPage !== totalPages) {
            pages.push(currentPage);
        }
    
        // Include the page after current page if it's less than the last page
        if (currentPage < totalPages - 1) {
            pages.push(currentPage + 1);
        }
    
        // Include ellipsis if there are pages skipped after current page
        if (currentPage < totalPages - 2) {
            pages.push("...");
        }
    
        // Always include the last page if there's more than one page
        if (totalPages > 1) {
            pages.push(totalPages);
        }
    
        return pages;
    }

    render() {
        const { currentPage, totalPages, onPageChange } = this.props;

        const pagesToShow = this.getPageNumbers();

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

                    {/* Dynamic Page Numbers */}
                    {pagesToShow.map((page, index) => (
                        <li key={index} className={`page-item ${page === currentPage ? 'active' : ''} ${typeof page === 'string' ? 'disabled' : ''}`}>
                            {typeof page === 'number' ? (
                                <a 
                                    className="page-link" 
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent default anchor behavior
                                        onPageChange(page);
                                    }}
                                >
                                    {page}
                                </a>
                            ) : (
                                <span className="page-link">{page}</span>
                            )}
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