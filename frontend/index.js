import { backend } from "declarations/backend";

class CitySimulator {
    constructor() {
        this.selectedBuilding = null;
        this.selectedOrientation = "north";
        this.grid = document.getElementById('grid');
        this.loadingSpinner = document.getElementById('loading');
        this.car = document.getElementById('car');
        this.carPosition = { x: 0, y: 0 };
        this.carDirection = "east";
        
        this.initializeGrid();
        this.initializeControls();
        this.initializeGame();
        this.startCarMovement();
    }

    async initializeGame() {
        await this.initializeStreets();
        await this.loadExistingBuildings();
    }

    showLoading() {
        this.loadingSpinner.classList.add('active');
    }

    hideLoading() {
        this.loadingSpinner.classList.remove('active');
    }

    initializeGrid() {
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

        const orientationButtons = document.querySelectorAll('[data-orientation]');
        orientationButtons.forEach(button => {
            button.addEventListener('click', () => {
                orientationButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.selectedOrientation = button.dataset.orientation;
            });
        });
    }

    async initializeStreets() {
        try {
            this.showLoading();
            await backend.initializeStreets();
            const streets = await backend.getStreets();
            streets.forEach(street => {
                const cell = this.getCellAt(street.position[0], street.position[1]);
                if (cell) {
                    cell.classList.add(`street-${street.direction}`);
                }
            });
        } catch (error) {
            console.error('Error initializing streets:', error);
        } finally {
            this.hideLoading();
        }
    }

    async loadExistingBuildings() {
        try {
            this.showLoading();
            const buildings = await backend.getAllBuildings();
            buildings.forEach(([id, building]) => {
                const cell = this.getCellAt(building.position[0], building.position[1]);
                if (cell) {
                    cell.className = `grid-cell ${building.buildingType} ${building.orientation}`;
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

        if (cell.classList.contains('street-horizontal') || cell.classList.contains('street-vertical')) {
            return;
        }

        if (cell.classList.contains('house') || 
            cell.classList.contains('shop') || 
            cell.classList.contains('factory')) {
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

        try {
            this.showLoading();
            const buildingId = `building_${Date.now()}`;
            const success = await backend.addBuilding(
                buildingId,
                this.selectedBuilding,
                x,
                y,
                this.selectedOrientation
            );

            if (success) {
                cell.className = `grid-cell ${this.selectedBuilding} ${this.selectedOrientation}`;
                cell.dataset.buildingId = buildingId;
            }
        } catch (error) {
            console.error('Error adding building:', error);
        } finally {
            this.hideLoading();
        }
    }

    async startCarMovement() {
        const movecar = async () => {
            const streets = await backend.getStreets();
            const streetPositions = streets.map(s => `${s.position[0]},${s.position[1]}`);
            
            let newX = this.carPosition.x;
            let newY = this.carPosition.y;
            
            switch(this.carDirection) {
                case "east":
                    newX = (newX + 1) % 10;
                    break;
                case "west":
                    newX = (newX - 1 + 10) % 10;
                    break;
                case "north":
                    newY = (newY - 1 + 10) % 10;
                    break;
                case "south":
                    newY = (newY + 1) % 10;
                    break;
            }

            if (streetPositions.includes(`${newX},${newY}`)) {
                this.carPosition.x = newX;
                this.carPosition.y = newY;
                
                const cell = this.getCellAt(newX, newY);
                const rect = cell.getBoundingClientRect();
                const gridRect = this.grid.getBoundingClientRect();
                
                this.car.style.left = `${rect.left - gridRect.left}px`;
                this.car.style.top = `${rect.top - gridRect.top}px`;
                this.car.className = `car ${this.carDirection}`;
                
                await backend.updateCarPosition(newX, newY, this.carDirection);
            } else {
                // Change direction if we can't move
                const directions = ["north", "east", "south", "west"];
                this.carDirection = directions[(directions.indexOf(this.carDirection) + 1) % 4];
            }
        };

        setInterval(movecar, 1000);
    }
}

window.addEventListener('load', () => {
    new CitySimulator();
});
