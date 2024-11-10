import { backend } from "declarations/backend";

class CitySimulator {
    constructor() {
        this.selectedBuilding = null;
        this.grid = document.getElementById('grid');
        this.loadingSpinner = document.getElementById('loading');
        this.initializeGrid();
        this.initializeControls();
        this.loadExistingBuildings();
    }

    showLoading() {
        this.loadingSpinner.classList.add('active');
    }

    hideLoading() {
        this.loadingSpinner.classList.remove('active');
    }

    initializeGrid() {
        // Create a 10x10 grid
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.addEventListener('click', () => this.handleCellClick(cell, x, y));
                this.grid.appendChild(cell);
            }
        }
    }

    initializeControls() {
        const buildingButtons = document.querySelectorAll('[data-building]');
        buildingButtons.forEach(button => {
            button.addEventListener('click', () => {
                buildingButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.selectedBuilding = button.dataset.building;
            });
        });
    }

    async loadExistingBuildings() {
        try {
            this.showLoading();
            const buildings = await backend.getAllBuildings();
            buildings.forEach(([id, building]) => {
                const cell = this.getCellAt(building.position[0], building.position[1]);
                if (cell) {
                    cell.className = `grid-cell ${building.buildingType}`;
                    cell.dataset.buildingId = id;
                }
            });
        } catch (error) {
            console.error('Error loading buildings:', error);
        } finally {
            this.hideLoading();
        }
    }

    getCellAt(x, y) {
        return this.grid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    }

    async handleCellClick(cell, x, y) {
        if (!this.selectedBuilding) {
            alert('Please select a building type first!');
            return;
        }

        if (cell.classList.contains('house') || 
            cell.classList.contains('shop') || 
            cell.classList.contains('factory')) {
            // Remove existing building
            try {
                this.showLoading();
                const success = await backend.removeBuilding(cell.dataset.buildingId);
                if (success) {
                    cell.className = 'grid-cell';
                    delete cell.dataset.buildingId;
                }
            } catch (error) {
                console.error('Error removing building:', error);
            } finally {
                this.hideLoading();
            }
            return;
        }

        // Add new building
        try {
            this.showLoading();
            const buildingId = `building_${Date.now()}`;
            const success = await backend.addBuilding(
                buildingId,
                this.selectedBuilding,
                x,
                y
            );

            if (success) {
                cell.className = `grid-cell ${this.selectedBuilding}`;
                cell.dataset.buildingId = buildingId;
            }
        } catch (error) {
            console.error('Error adding building:', error);
        } finally {
            this.hideLoading();
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new CitySimulator();
});
