#include <iostream>
#include <string>

int main (){
    std::string IP; // Ip сервера
    int PORT; // Порт сервера

    // Ввод ip для подключения к серверу
    std::cout << "Введите IP сервера: ";
    std::cin >> IP;

    // Ввод порта для подключения к серверу
    std::cout << "Введите порт сервера: ";
    std::cin >> PORT;

    std::cout << "http://" << IP << ":" << PORT << '\n';    

}